import type { Metadata } from "next";

import { Shelf } from "@/components/Shelf";
import creatorsShelf from "@/data/creators-shelf.json";
import { MONTHS } from "@/lib/normalise";
import type { Book, ShelfData } from "@/lib/types";

export const metadata: Metadata = {
  title: "arushi's shelf • my shelf",
};

function toShelfData(
  raw: Record<string, Partial<Record<(typeof MONTHS)[number], Book[]>>>,
): ShelfData {
  const shelf: ShelfData = {};

  for (const [year, months] of Object.entries(raw)) {
    shelf[year] = Object.fromEntries(
      MONTHS.map((month) => [month, months[month] ?? []]),
    ) as ShelfData[string];
  }

  return shelf;
}

export default function CreatorsShelfPage() {
  return (
    <Shelf
      initialData={toShelfData(creatorsShelf)}
      title="arushi's shelf"
      subtitle="a permanent little corner of books I keep on display"
      showSourceBar={false}
      actionHref="/"
      actionLabel="← home"
    />
  );
}
