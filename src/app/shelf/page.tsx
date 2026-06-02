import { Shelf } from "@/components/Shelf";
import type { Source } from "@/lib/types";

export default async function ShelfPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: Source }>;
}) {
  const { source } = await searchParams;

  return <Shelf source={source} />;
}
