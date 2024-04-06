const https = require("https");
const { ParseOne } = require("unzipper");
const { parse } = require("csv");
const { createPool } = require("@vercel/postgres");

const CONCURRENCY = 72;

https.get(
  `https://data.nasdaq.com/api/v3/databases/FRED/metadata?api_key=${process.env.NASDAQ_API_KEY}`,
  (res) => {
    if (res.statusCode === 302 && res.headers.location) {
      https.get(res.headers.location, async (response) => {
        const pool = createPool({
          max: CONCURRENCY,
        });
        await pool.sql`DROP TABLE IF EXISTS fred_datasets;`;
        await pool.sql`CREATE TABLE fred_datasets (
          code VARCHAR(50) PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          refreshed_at CHAR(19) NOT NULL,
          from_date CHAR(10) NOT NULL,
          to_date CHAR(10) NOT NULL
        );`;
        const stream = response.pipe(ParseOne()).pipe(parse({ columns: true }));
        const state = { start: Date.now(), rows: 0 };
        process.stdout.write("\n\n");
        stream.on("data", () => {
          process.stdout.moveCursor(0, -2);
          process.stdout.clearLine(0);
          process.stdout.cursorTo(0);
          process.stdout.write(`\x1b[32m${++state.rows}\x1b[0m\trows\n`);
          process.stdout.clearLine(0);
          process.stdout.cursorTo(0);
          process.stdout.write(
            `\x1b[32m${(Date.now() - state.start) / 1000}\x1b[0m\tseconds\n`
          );
        });
        await stream.forEach(
          (record) =>
            pool.sql`
              INSERT INTO fred_datasets (code, name, description, refreshed_at, from_date, to_date)
              VALUES (${record.code}, ${record.name}, ${record.description}, ${record.refreshed_at}, ${record.from_date}, ${record.to_date})
              ON CONFLICT (code)
              DO NOTHING;
            `,
          { concurrency: CONCURRENCY }
        );
        await pool.end();
        process.exit(0);
      });
    } else {
      console.error("Unable to download the FRED metadata.");
      process.exit(1);
    }
  }
);
