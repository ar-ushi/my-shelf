import type { ShelfData } from "@/lib/types";

const ISBN_COVER_BASE = "https://covers.openlibrary.org/b/isbn";
const ID_COVER_BASE = "https://covers.openlibrary.org/b/id";
const SEARCH_URL = "https://openlibrary.org/search.json";

// Open Library answers a missing cover with a tiny blank (a 1x1 pixel, or its
// grey "no cover" placeholder) and an HTTP 200 — so a 200 alone doesn't mean a
// real cover came back. A genuine cover is far larger than this in bytes;
// anything below this floor is treated as "no cover".
const MIN_COVER_BYTES = 1000;

type OpenLibraryDoc = {
  cover_i?: number;
  isbn?: string[];
  number_of_pages_median?: number;
  subject?: string[];
  series?: string[];
};

type OpenLibraryMetadata = {
  cover: string;
  pages: number;
  genres: string[];
  series: string[];
};

/** Strip Goodreads' ="..." wrapper and separators, leaving the bare ISBN. */
export function cleanISBN(value: string | undefined): string {
  return (value ?? "").replace(/[^0-9Xx]/g, "");
}

/**
 * Open Library cover URL for a known ISBN. This only builds a candidate URL —
 * it does no network call, so the image isn't guaranteed to exist. Real
 * validation happens later in `enrichCoversFromOpenLibrary`.
 * `default=false` makes truly-missing covers 404, but Open Library still hands
 * back blank 1x1 images for some ISBNs, which is why we verify the bytes.
 */
export function coverFromISBN(isbn: string | undefined): string {
  return isbn ? `${ISBN_COVER_BASE}/${isbn}-L.jpg?default=false` : "";
}

/**
 * Confirm a candidate cover is a real image, not Open Library's blank/1x1
 * placeholder — using a cheap HEAD request so we never download the image
 * bytes. Rejects on network error, non-200, or a `Content-Length` below the
 * blank-placeholder threshold. A missing/zero `Content-Length` is treated as
 * valid rather than dropping a cover we couldn't measure.
 */
async function isRealCover(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    if (!res.ok) return false;

    const length = Number(res.headers.get("content-length"));
    if (!length) return true;

    return length >= MIN_COVER_BYTES;
  } catch {
    return false;
  }
}

function cleanFacetList(values: string[] | undefined, limit: number): string[] {
  return Array.from(
    new Set(
      (values ?? [])
        .map((value) => value.trim())
        .filter((value) => value.length >= 3 && value.length <= 32)
        .filter((value) => !/[0-9]{4}/.test(value))
        .filter((value) => !/[()[\]{}]/.test(value)),
    ),
  ).slice(0, limit);
}

function mergeUnique(existing: string[] | undefined, next: string[]): string[] {
  return Array.from(new Set([...(existing ?? []), ...next]));
}

function metadataFromDoc(doc: OpenLibraryDoc | undefined): OpenLibraryMetadata | null {
  if (!doc) return null;

  const cover = doc.cover_i
    ? `${ID_COVER_BASE}/${doc.cover_i}-L.jpg?default=false`
    : coverFromISBN(doc.isbn?.[0]);

  return {
    cover,
    pages: Math.max(0, Number(doc.number_of_pages_median ?? 0)),
    genres: cleanFacetList(doc.subject, 6),
    series: cleanFacetList(doc.series, 3),
  };
}

/** Best-effort Open Library lookup by title/author for cover + metadata. */
export async function searchOpenLibrary(
  title: string,
  author: string,
): Promise<OpenLibraryMetadata | null> {
  const params = new URLSearchParams({
    title,
    limit: "1",
    fields: "cover_i,isbn,number_of_pages_median,subject,series",
  });
  if (author) params.set("author", author);

  try {
    const res = await fetch(`${SEARCH_URL}?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;

    const json = await res.json();
    return metadataFromDoc(json?.docs?.[0]);
  } catch {
    return null;
  }
}

export function applyOpenLibraryMetadata<T extends {
  cover: string;
  pages: number;
  genres?: string[];
  series?: string[];
}>(
  book: T,
  metadata: OpenLibraryMetadata,
): T {
  return {
    ...book,
    pages: book.pages > 0 ? book.pages : metadata.pages,
    genres: metadata.genres.length > 0
      ? mergeUnique(book.genres, metadata.genres)
      : (book.genres ?? []),
    series: metadata.series.length > 0
      ? mergeUnique(book.series, metadata.series)
      : (book.series ?? []),
  };
}

/** Run async work over items with a bounded concurrency. */
async function mapPool<T>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<void>,
): Promise<void> {
  for (let i = 0; i < items.length; i += limit) {
    await Promise.all(items.slice(i, i + limit).map(fn));
  }
}

/**
 * Resolve covers during import, mutating and returning the shelf:
 *   1. Verify any ISBN-derived cover actually resolves to a real image;
 *      drop it if Open Library returned a blank/1x1 placeholder.
 *   2. Only books marked in normalisation as lacking a cover are searched.
 *      If that search happens, we opportunistically keep the extra metadata.
 */
export async function enrichCoversFromOpenLibrary(
  shelf: ShelfData,
): Promise<ShelfData> {
  const books = Object.values(shelf)
    .flatMap((months) => Object.values(months))
    .flat();

  await mapPool(books, 12, async (book) => {
    book.series ??= [];
    book.genres ??= [];
    book.metadataChecked ??= false;

    // Validate the ISBN-derived candidate; clear it if it isn't a real cover.
    if (book.cover && !(await isRealCover(book.cover))) {
      book.cover = "";
      book.searchOnImport = true;
    }

    if (!book.searchOnImport) return;

    const metadata = await searchOpenLibrary(book.title, book.author);
    book.searchOnImport = false;
    if (!metadata) return;

    if (!book.cover && metadata.cover && (await isRealCover(metadata.cover))) {
      book.cover = metadata.cover;
    }
    Object.assign(book, applyOpenLibraryMetadata(book, metadata));
  });

  return shelf;
}
