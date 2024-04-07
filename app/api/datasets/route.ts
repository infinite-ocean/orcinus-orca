import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { FREDDataset } from "@/app/lib/Dataset";

export async function GET(request: NextRequest) {
  // TODO: use zod to parse url search params
  const last_name = request.nextUrl.searchParams.get("last_name");
  const last_code = request.nextUrl.searchParams.get("last_code");
  const limit = request.nextUrl.searchParams.get("limit");
  try {
    const data = await sql<FREDDataset>`
        SELECT *
        FROM fred_datasets
        WHERE name > ${last_name} OR ( name = ${last_name} AND code > ${last_code} )
        ORDER BY name ASC, code ASC
        LIMIT ${limit};
    `;
    return NextResponse.json(data.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
