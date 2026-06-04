import { format, isValid, parse } from "date-fns";

import type { Book, MonthKey, ShelfData } from "@/lib/types";
import { cleanISBN, coverFromISBN } from "@/lib/covers";

export const MONTHS: MonthKey[] = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// While bucketing we only ever touch the months that actually have books, so
// the working shape is partial. We cast back to ShelfData on return.
type MutableShelf = Record<string, Partial<Record<MonthKey, Book[]>>>;

function addBook(shelf: MutableShelf, date: Date, book: Book): void {
  const year = String(date.getFullYear());
  const month = MONTHS[date.getMonth()];
  const byMonth = (shelf[year] ??= {});
  (byMonth[month] ??= []).push(book);
}

function toInt(value: unknown): number {
  const n = parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function toRating(value: unknown): number {
  const n = Number.parseFloat(String(value ?? "").trim());
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(5, Math.round(n)));
}

function splitList(value: string | undefined): string[] {
  return String(value ?? "")
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function field(row: Record<string, string>, ...keys: string[]): string {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

// --- Goodreads CSV --------------------------------------------------------

function parseDateRead(value: string): Date | null {
  if (!value) return null;
  for (const fmt of [
    "yyyy/MM/dd",
    "yyyy-MM-dd",
    "M/d/yyyy",
    "MM/dd/yyyy",
    "M/d/yy",
    "MM/dd/yy",
  ]) {
    const parsed = parse(value, fmt, new Date());
    if (isValid(parsed)) return parsed;
  }
  const fallback = new Date(value);
  return isValid(fallback) ? fallback : null;
}

function parseStorygraphReadDate(row: Record<string, string>): Date | null {
  const lastDateRead = field(row, "Last Date Read", "last date read");
  if (lastDateRead) return parseDateRead(lastDateRead);

  const datesRead = field(row, "Dates Read", "dates read");
  if (datesRead) {
    const parts = datesRead
      .split(/[;,|]/)
      .map((part) => part.trim())
      .filter(Boolean);
    for (let i = parts.length - 1; i >= 0; i -= 1) {
      const parsed = parseDateRead(parts[i]);
      if (parsed) return parsed;
    }
  }

  return parseDateRead(field(row, "Date Added", "date added"));
}

export function normaliseGoodreadsCSV(rows: Record<string, string>[]): ShelfData {
  const shelf: MutableShelf = {};

  for (const row of rows) {
    const shelfName = (row["Exclusive Shelf"] ?? "").trim().toLowerCase();
    if (shelfName !== "read") continue; // only books actually read

    const title = (row["Title"] ?? "").trim();
    if (!title) continue;

    const bucketDate = parseDateRead((row["Date Read"] ?? "").trim());
    if (!bucketDate) continue;

    // Goodreads exports ISBN13/ISBN — build an Open Library cover from it.
    // Moods are intentionally left empty: StoryGraph (the only mood source) has
    // no per-title search, and a CSV book likely isn't on the owner's shelf.
    const isbn = cleanISBN(row["ISBN13"]) || cleanISBN(row["ISBN"]);

    const book: Book = {
      title,
      author: (row["Author"] ?? "").trim(),
      rating: toInt(row["My Rating"]),
      pages: toInt(row["Number of Pages"]),
      date: format(bucketDate, "MMM d"),
      dateISO: format(bucketDate, "yyyy-MM-dd"),
      tags: [],
      moods: [],
      review: (row["My Review"] ?? "").trim(),
      cover: coverFromISBN(isbn),
      isbn,
      series: [],
      genres: [],
      searchOnImport: !coverFromISBN(isbn),
      metadataChecked: false,
    };
    addBook(shelf, bucketDate, book);
  }

  return shelf as ShelfData;
}

export function normaliseStorygraphCSV(rows: Record<string, string>[]): ShelfData {
  const shelf: MutableShelf = {};

  for (const row of rows) {
    const readStatus = field(row, "Read Status", "read status").toLowerCase();
    const readCount = toInt(field(row, "Read Count", "read count"));
    const lastDateRead = field(row, "Last Date Read", "last date read");
    const datesRead = field(row, "Dates Read", "dates read");

    // "to-read" and "currently-reading" both *contain* "read", so match the
    // status exactly; keep rows with read evidence even if status is blank.
    if (
      readStatus !== "read" &&
      readCount <= 0 &&
      !lastDateRead &&
      !datesRead
    ) {
      continue;
    }

    const title = field(row, "Title", "title");
    if (!title) continue;

    const bucketDate = parseStorygraphReadDate(row);
    if (!bucketDate) continue;
    const author = field(row, "Authors", "Author", "authors", "author");
    const isbn = cleanISBN(field(row, "ISBN/UID", "ISBN", "isbn", "uid"));

    const book: Book = {
      title,
      author,
      rating: toRating(field(row, "Star Rating", "star rating")),
      pages: toInt(field(row, "Pages", "Page Count", "page count")),
      date: format(bucketDate, "MMM d"),
      dateISO: format(bucketDate, "yyyy-MM-dd"),
      tags: splitList(field(row, "Tags", "tags")),
      moods: splitList(field(row, "Moods", "moods")),
      review: field(row, "Review", "review"),
      cover: coverFromISBN(isbn),
      isbn,
      series: [],
      genres: [],
      searchOnImport: !coverFromISBN(isbn),
      metadataChecked: false,
    };
    addBook(shelf, bucketDate, book);
  }

  return shelf as ShelfData;
}
