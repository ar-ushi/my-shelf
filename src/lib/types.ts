export type Book = {
  title: string
  author: string
  rating: number        // 0–5 (may be a half value, e.g. 4.5, from StoryGraph)
  pages: number         // 0 when the export provides no page count
  date: string          // "Jan 12" — display label
  dateISO: string       // "2026-01-12" for sorting
  tags: string[]        // genre tags
  moods: string[]       // mood tags
  review: string
  cover: string         // URL or empty string
}

export type MonthKey = 'Jan'|'Feb'|'Mar'|'Apr'|'May'|'Jun'|'Jul'|'Aug'|'Sep'|'Oct'|'Nov'|'Dec'
export type ShelfData = Record<string, Record<MonthKey, Book[]>>  // year → month → books

// Both supported exports are CSV uploads; the source tells us which column
// layout to expect (see lib/normalise.ts).
export type Source = 'goodreads' | 'storygraph'
export type ViewMode = 'month' | 'year'

export const SOURCE_LABELS: Record<Source, string> = {
  storygraph: 'StoryGraph',
  goodreads: 'Goodreads',
}
