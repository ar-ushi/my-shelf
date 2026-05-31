"use client";

import { useEffect, useState } from "react";

import type { ShelfData } from "@/lib/types";
import { fetchStorygraphBooks } from "@/lib/storygraph";

type UseBooksResult = {
  data: ShelfData;
  isLoading: boolean;
  error: string | null;
};

const emptyShelf: ShelfData = {
  source: "storygraph",
  books: [],
  periodLabel: "All time",
};

export function useBooks(): UseBooksResult {
  const [data, setData] = useState<ShelfData>(emptyShelf);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBooks() {
      try {
        const nextData = await fetchStorygraphBooks();

        if (isMounted) {
          setData(nextData);
        }
      } catch {
        if (isMounted) {
          setError("Unable to load books.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadBooks();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, error };
}
