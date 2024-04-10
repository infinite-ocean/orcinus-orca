import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { DatasetMetadataType } from "@/app/lib/Dataset";

export async function GET(request: NextRequest) {
  const last_name = request.nextUrl.searchParams.get("last_name");
  const last_code = request.nextUrl.searchParams.get("last_code");
  const query = `%${request.nextUrl.searchParams.get("query")}%`;
  const limit = 100;
  try {
    const data = await sql<DatasetMetadataType>`
        SELECT *
        FROM fred_datasets
        WHERE name LIKE ${query} AND ( name > ${last_name} OR ( name = ${last_name} AND code > ${last_code} ) )
        ORDER BY name ASC, code ASC
        LIMIT ${limit};
    `;
    return NextResponse.json(
      {
        completed: data.rows.length < limit,
        datasets: data.rows,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
