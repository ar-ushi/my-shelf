export type Book = {
  title: string
  author: string
  rating: number        // 1–5
  pages: number
  date: string          // "Jan 12"
  dateISO: string       // "2026-01-12" for sorting
  tags: string[]        // genre tags
  moods: string[]       // mood tags
  review: string
  cover: string         // URL or empty string
}

export type MonthKey = 'Jan'|'Feb'|'Mar'|'Apr'|'May'|'Jun'|'Jul'|'Aug'|'Sep'|'Oct'|'Nov'|'Dec'
export type ShelfData = Record<string, Record<MonthKey, Book[]>>  // year → month → books
export type Source = 'storygraph' | 'csv' 
export type ViewMode = 'month' | 'year'