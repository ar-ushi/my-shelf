import type { Book } from "@/lib/types";

type DetailPanelProps = {
  book: Book | null;
};

export function DetailPanel({ book }: DetailPanelProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6">
      <h2 className="text-lg font-medium text-zinc-900">DetailPanel</h2>
      <p className="mt-2 text-sm text-zinc-500">
        {book
          ? `Placeholder details for ${book.title}.`
          : "No book selected yet. Expanded details will appear here."}
      </p>
    </section>
  );
}
