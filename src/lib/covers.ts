import type { ShelfData } from "@/lib/types";

const ISBN_COVER_BASE = "https://covers.openlibrary.org/b/isbn";
const ID_COVER_BASE = "https://covers.openlibrary.org/b/id";
const SEARCH_URL = "https://openlibrary.org/search.json";

// Open Library answers a missing cover with a tiny blank (a 1x1 pixel, or its
// grey "no cover" placeholder) and an HTTP 200 — so a 200 alone doesn't mean a
// real cover came back. A genuine cover is far larger than this in bytes;
// anything below this floor is treated as "no cover".
const MIN_COVER_BYTES = 1000;

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

/** Best-effort cover lookup by title/author via Open Library search. */
async function searchCover(title: string, author: string): Promise<string> {
  const params = new URLSearchParams({ title, limit: "1", fields: "cover_i" });
  if (author) params.set("author", author);
  try {
    const res = await fetch(`${SEARCH_URL}?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return "";
    const json = await res.json();
    const coverId = json?.docs?.[0]?.cover_i;
    return coverId ? `${ID_COVER_BASE}/${coverId}-L.jpg?default=false` : "";
  } catch {
    return "";
  }
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
 * Resolve a real cover for every book, mutating and returning the shelf:
 *   1. Verify any ISBN-derived cover actually resolves to a real image;
 *      drop it if Open Library returned a blank/1x1 placeholder.
 *   2. For books left without a cover, fall back to Open Library search and
 *      verify that result the same way.
 */
export async function enrichCoversFromOpenLibrary(
  shelf: ShelfData,
): Promise<ShelfData> {
  const books = Object.values(shelf)
    .flatMap((months) => Object.values(months))
    .flat();

  await mapPool(books, 12, async (book) => {
    // Validate the ISBN-derived candidate; clear it if it isn't a real cover.
    if (book.cover && !(await isRealCover(book.cover))) {
      book.cover = "";
    }

    // Still uncovered (no ISBN, or its cover was blank) → try search.
    if (!book.cover) {
      const url = await searchCover(book.title, book.author);
      if (url && (await isRealCover(url))) book.cover = url;
    }
  });

  return shelf;
}
