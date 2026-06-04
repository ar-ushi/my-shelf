import type { Metadata } from "next";

import { Shelf } from "@/components/Shelf";
import creatorsShelf from "@/data/creators-shelf.json";
import type { ShelfData } from "@/lib/types";

export const metadata: Metadata = {
  title: "arushi's shelf • my shelf",
};

export default function CreatorsShelfPage() {
  return (
    <Shelf
      initialData={creatorsShelf as ShelfData}
      title="arushi's shelf"
      subtitle="a permanent little corner of books I keep on display"
      showSourceBar={false}
      actionHref="/"
      actionLabel="← home"
    />
  );
}
