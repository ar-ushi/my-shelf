import { applyOpenLibraryMetadata, searchOpenLibrary } from "@/lib/covers";
import type { Book } from "@/lib/types";

type MetadataRequest = {
  title?: string;
  author?: string;
  pages?: number;
  genres?: string[];
  series?: string[];
  cover?: string;
};

export async function POST(request: Request) {
  const body = await request.json() as MetadataRequest;
  const title = body.title?.trim();
  const author = body.author?.trim() ?? "";

  if (!title) {
    return Response.json({ error: "title is required" }, { status: 400 });
  }

  const metadata = await searchOpenLibrary(title, author);
  if (!metadata) {
    return Response.json({ metadataChecked: true });
  }

  const baseBook: Pick<Book, "cover" | "pages" | "genres" | "series"> = {
    cover: body.cover ?? "",
    pages: body.pages ?? 0,
    genres: body.genres ?? [],
    series: body.series ?? [],
  };

  return Response.json({
    ...applyOpenLibraryMetadata(baseBook, metadata),
    metadataChecked: true,
  });
}
