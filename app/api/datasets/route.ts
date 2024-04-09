import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { FREDDataset } from "@/app/lib/Dataset";

export async function GET(request: NextRequest) {
  const last_name = request.nextUrl.searchParams.get("last_name");
  const last_code = request.nextUrl.searchParams.get("last_code");
  const LIMIT = 100;
  try {
    const data = await sql<FREDDataset>`
        SELECT *
        FROM fred_datasets
        WHERE name > ${last_name} OR ( name = ${last_name} AND code > ${last_code} )
        ORDER BY name ASC, code ASC
        LIMIT ${LIMIT};
    `;
    return NextResponse.json({
      completed: data.rows.length < LIMIT,
      datasets: data.rows,
    });
  } catch (error) {
    return NextResponse.error();
  }
}
