import { DatasetSchema } from "@/app/lib/Dataset";

export default async function Dataset({
  params: { code },
}: {
  params: { code: string };
}) {
  return fetch(
    `https://data.nasdaq.com/api/v3/datasets/FRED/${code}?api_key=${process.env.NASDAQ_API_KEY}`
  )
    .then((response) => response.json())
    .then((dataset) => DatasetSchema.parseAsync(dataset))
    .then((dataset) => <pre>{JSON.stringify(dataset, undefined, 2)}</pre>)
    .catch((error) => console.error(error));
}
