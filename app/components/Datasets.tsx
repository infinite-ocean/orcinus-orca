"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FREDDatasets, FREDDatasetsSchema } from "@/app/lib/Dataset";

export default function Datasets() {
  const [lastName, setLastName] = useState("");
  const [lastCode, setLastCode] = useState("");
  const [datasets, setDatasets] = useState<FREDDatasets>([]);
  useEffect(() => {
    const abortController = new AbortController();
    fetch(
      `/api/datasets?${new URLSearchParams({
        last_name: lastName,
        last_code: lastCode,
        limit: "200",
      }).toString()}`,
      { signal: abortController.signal }
    )
      .then((response) => response.json())
      .then((datasets) => FREDDatasetsSchema.safeParseAsync(datasets))
      .then((parsed) => {
        if (parsed.success) {
          //   const last = parsed.data.slice(-1)[0];
          //   setLastName(last.name);
          //   setLastCode(last.code);
          //   setDatasets(datasets.concat(parsed.data));
          setDatasets(parsed.data);
        } else throw parsed.error;
      })
      .catch((error) => console.error(error));
    return () => abortController.abort();
  }, [lastCode, lastName]);

  return (
    <>
      {datasets.map((dataset) => (
        <Link
          key={dataset.code}
          className="block p-1 m-1 border hover:bg-slate-500"
          href={`/dataset/${dataset.code}`}
        >
          {dataset.name}
        </Link>
      ))}
    </>
  );
}
