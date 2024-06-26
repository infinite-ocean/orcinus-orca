"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { type DatasetMetadataType, DatasetListSchema } from "@/app/lib/Dataset";
import { clsx } from "clsx";
import { usePathname } from "next/navigation";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function Datasets() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [datasets, setDatasets] = useState<DatasetMetadataType[]>([]);
  const [query, setQuery] = useState<string | null>(null);

  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchDatasets = useCallback(() => {
    setLoading(true);
    const last = datasets.at(-1);
    fetch(
      `/api/datasets?${new URLSearchParams({
        last_name: last?.name || "",
        last_code: last?.code || "",
        query: query || "",
      }).toString()}`
    )
      .then((response) => response.json())
      .then((datasets) => DatasetListSchema.parseAsync(datasets))
      .then(({ completed, datasets }) => {
        setCompleted(completed);
        setDatasets((prevDatasets) => [...prevDatasets, ...datasets]);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [datasets, query]);

  const search = useCallback((formData: FormData) => {
    setQuery(formData.get("query")?.toString() || null);
    setCompleted(false);
    setDatasets([]);
  }, []);

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
      <form action={search} className="border-b flex sticky top-0 bg-white">
        <input name="query" className="flex-1 p-1 m-1" />
        <IconButton
          type="submit"
          color="primary"
          size="small"
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      </form>
      {datasets.map((dataset) => (
        <Link
          key={dataset.code}
          className={`block p-3 border-t first-of-type:border-none hover:bg-slate-500 ${
            pathname === `/dataset/${dataset.code}` ? "bg-slate-500" : ""
          }`}
          href={`/dataset/${dataset.code}`}
        >
          {dataset.name}
        </Link>
      ))}
      <div ref={loaderRef}>
        <div
          className={`border-t text-center p-2 ${clsx(loading || "hidden")}`}
        >
          <FontAwesomeIcon icon={faSpinner} spin />
        </div>
      </div>
    </>
  );
}
