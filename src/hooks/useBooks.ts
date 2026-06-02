"use client";

import { useEffect, useState } from "react";

import type { ShelfData, Source } from "@/lib/types";

// Must match the key LandingPage writes the uploaded CSV text under.
const CSV_DATA_KEY = "myshelf:csv";

type UseBooksArgs = {
  source?: Source;
};

type UseBooksResult = {
  data: ShelfData;
  isLoading: boolean;
  error: string | null;
};

export function useBooks({ source }: UseBooksArgs = {}): UseBooksResult {
  const [data, setData] = useState<ShelfData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBooks() {
      setIsLoading(true);
      setError(null);

      try {
        let shelf: ShelfData = {};

        if (source) {
          const csv = sessionStorage.getItem(CSV_DATA_KEY) ?? "";
          if (!csv) throw new Error("No CSV found — please upload it again.");
          const res = await fetch(`/api/shelf?source=${encodeURIComponent(source)}`, {
            method: "POST",
            headers: { "Content-Type": "text/csv" },
            body: csv,
          });
          if (!res.ok) throw new Error("Unable to read that CSV.");
          shelf = await res.json();
        }

        if (isMounted) setData(shelf);
      } catch (caught) {
        if (isMounted) setError((caught as Error).message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadBooks();

    return () => {
      isMounted = false;
    };
  }, [source]);

  return { data, isLoading, error };
}
