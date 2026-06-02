import Papa from "papaparse";

import type { ShelfData, Source } from "@/lib/types";
import { normaliseGoodreadsCSV, normaliseStorygraphCSV } from "@/lib/normalise";

/** Parse a supported CSV export string into ShelfData (read books only). */
export function parseCSV(csvText: string, source: Source): ShelfData {
  const { data } = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (source === "storygraph") {
    return normaliseStorygraphCSV(data);
  }

  return normaliseGoodreadsCSV(data);
}
