"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { FREDDataset, FREDDatasetsSchema } from "@/app/lib/Dataset";

export default function Datasets() {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [datasets, setDatasets] = useState<FREDDataset[]>([]);

  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchDatasets = useCallback(() => {
    setLoading(true);
    const last = datasets.at(-1);
    fetch(
      `/api/datasets?${new URLSearchParams({
        last_name: last?.name || "",
        last_code: last?.code || "",
      }).toString()}`
    )
      .then((response) => response.json())
      .then((datasets) => FREDDatasetsSchema.parseAsync(datasets))
      .then(({ completed, datasets }) => {
        setCompleted(completed);
        setDatasets((prevDatasets) => [...prevDatasets, ...datasets]);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [datasets]);

  // infinite scroll effect
  useEffect(() => {
    const loaderCurrent = loaderRef.current;
    if (loaderCurrent) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          completed || fetchDatasets();
        }
      });
      observer.observe(loaderCurrent);
      return () => {
        observer.unobserve(loaderCurrent);
      };
    }
  }, [completed, fetchDatasets]);

  return (
    <>
      {datasets.map((dataset) => (
        <Link
          key={dataset.code}
          className="block p-3 border-t first-of-type:border-none hover:bg-slate-500"
          href={`/dataset/${dataset.code}`}
        >
          {dataset.name}
        </Link>
      ))}
      <div ref={loaderRef}>{loading && "Loading..."}</div>
    </>
  );
}
