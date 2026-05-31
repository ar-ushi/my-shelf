"use client";

import { useBooks } from "@/hooks/useBooks";
import { BookSpine } from "@/components/BookSpine";
import { Controls } from "@/components/Controls";
import { DetailPanel } from "@/components/DetailPanel";
import { SourceBar } from "@/components/SourceBar";
import { StatsRow } from "@/components/StatsRow";

export function Shelf() {
  const { data, isLoading } = useBooks();
  const selectedBook = data.books[0] ?? null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
          My Shelf
        </p>
        <h1 className="text-4xl font-semibold text-zinc-900">Shelf</h1>
        <p className="text-sm text-zinc-600">
          Dummy scaffold matching the requested project structure.
        </p>
      </header>

      <SourceBar />
      <Controls />
      <StatsRow />

      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-zinc-900">Book spines</h2>
          <span className="text-sm text-zinc-500">
            {isLoading ? "Loading..." : `${data.books.length} placeholder books`}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {data.books.length > 0 ? (
            data.books.map((book) => <BookSpine key={book.id} book={book} />)
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500">
              No books loaded yet. This is a dummy shelf shell.
            </div>
          )}
        </div>
      </section>

      <DetailPanel book={selectedBook} />
    </main>
  );
}
