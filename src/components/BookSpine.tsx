import type { Book } from "@/lib/types";

type BookSpineProps = {
  book: Book;
};

export function BookSpine({ book }: BookSpineProps) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Spine</p>
      <h3 className="mt-2 text-base font-medium text-zinc-900">{book.title}</h3>
      <p className="text-sm text-zinc-600">{book.author}</p>
    </article>
  );
}
