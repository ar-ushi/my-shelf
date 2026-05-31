import type { ShelfData } from "@/lib/types";

export async function fetchStorygraphBooks(): Promise<ShelfData> {
  return {
    source: "storygraph",
    books: [],
    periodLabel: "All time",
  };
}
