import { Shelf } from "@/components/Shelf";
import type { Source } from "@/lib/types";

export default async function ShelfPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: Source; username?: string }>;
}) {
  const { source, username } = await searchParams;

  return <Shelf source={source} username={username} />;
}
