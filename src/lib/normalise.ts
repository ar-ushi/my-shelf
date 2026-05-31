import type { BookSource, ShelfData } from "@/lib/types";

export function normalise(source: BookSource): ShelfData {
  return {
    source,
    books: [],
    periodLabel: "All time",
  };
}
