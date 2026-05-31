export type BookSource = "storygraph" | "csv" | "spreadsheet";

export type Book = {
  id: string;
  title: string;
  author: string;
  rating?: number;
  finishedAt?: string;
};

export type ShelfData = {
  source: BookSource;
  books: Book[];
  periodLabel: string;
};
