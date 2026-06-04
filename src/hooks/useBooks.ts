"use client";

import { useEffect, useState } from "react";

import type { Book, ShelfData, Source } from "@/lib/types";

// Must match the key LandingPage writes the uploaded CSV text under.
const CSV_DATA_KEY = "myshelf:csv";

type UseBooksArgs = {
  source?: Source;
  initialData?: ShelfData;
};

type UseBooksResult = {
  data: ShelfData;
  isLoading: boolean;
  error: string | null;
  patchBook: (
    match: Pick<Book, "title" | "author" | "dateISO">,
    patch: Partial<Book>,
  ) => void;
};

export function useBooks({ source, initialData }: UseBooksArgs = {}): UseBooksResult {
  const [data, setData] = useState<ShelfData>(initialData ?? {});
  const [isLoading, setIsLoading] = useState(source ? true : false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!source) return;

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
          console.log("Parsed shelf JSON from uploaded CSV:", shelf);
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

  function patchBook(
    match: Pick<Book, "title" | "author" | "dateISO">,
    patch: Partial<Book>,
  ) {
    setData((current) => {
      const next: ShelfData = {};

      for (const [year, months] of Object.entries(current)) {
        next[year] = { ...months };

        for (const [month, books] of Object.entries(months)) {
          next[year][month as keyof typeof months] = books.map((book) =>
            book.title === match.title &&
            book.author === match.author &&
            book.dateISO === match.dateISO
              ? { ...book, ...patch }
              : book,
          );
        }
      }

      return next;
    });
  }

  return { data, isLoading, error, patchBook };
}
