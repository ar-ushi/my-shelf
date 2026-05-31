import type { ShelfData } from "@/lib/types";

export function parseCSV(_input: string): ShelfData {
  void _input;

  return {
    source: "csv",
    books: [],
    periodLabel: "All time",
  };
}
