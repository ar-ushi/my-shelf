"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { useBooks } from "@/hooks/useBooks";
import { BookSpine } from "@/components/BookSpine";
import { Controls } from "@/components/Controls";
import { DetailPanel } from "@/components/DetailPanel";
import { SourceBar } from "@/components/SourceBar";
import { StatsRow } from "@/components/StatsRow";
import { MONTHS } from "@/lib/normalise";
import type { Book, MonthKey, Source, ViewMode } from "@/lib/types";

type ShelfProps = {
  source?: Source;
};

export function Shelf({ source }: ShelfProps) {
  const { data, isLoading, error } = useBooks({ source });

  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [yearSel, setYearSel] = useState<string | null>(null);
  const [monthSel, setMonthSel] = useState<MonthKey | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Years/months that actually hold books — selectors never show empties.
  const years = useMemo(
    () => Object.keys(data).sort((a, b) => Number(b) - Number(a)),
    [data],
  );
  const activeYear =
    yearSel && years.includes(yearSel) ? yearSel : years[0] ?? "";

  const months = useMemo<MonthKey[]>(
    () => MONTHS.filter((m) => (data[activeYear]?.[m]?.length ?? 0) > 0),
    [data, activeYear],
  );
  const activeMonth =
    monthSel && months.includes(monthSel) ? monthSel : months[0] ?? "Jan";

  // The books on the shelf right now: one month, or the whole year.
  const visible = useMemo<Book[]>(() => {
    if (!activeYear) return [];
    if (viewMode === "year") {
      return MONTHS.flatMap((m) => data[activeYear]?.[m] ?? []);
    }
    return data[activeYear]?.[activeMonth] ?? [];
  }, [data, activeYear, activeMonth, viewMode]);

  // Stats always describe the whole active year, not the month filter.
  const stats = useMemo(() => {
    const all = MONTHS.flatMap((m) => data[activeYear]?.[m] ?? []);
    const rated = all.filter((b) => b.rating > 0);
    return {
      booksRead: all.length,
      activeMonths: months.length,
      avgRating: rated.length
        ? rated.reduce((sum, b) => sum + b.rating, 0) / rated.length
        : null,
    };
  }, [data, activeYear, months.length]);

  function changeView(mode: ViewMode) {
    setViewMode(mode);
    setOpenIndex(null);
  }
  function changeYear(year: string) {
    setYearSel(year);
    setMonthSel(null);
    setOpenIndex(null);
  }
  function changeMonth(month: MonthKey) {
    setMonthSel(month);
    setOpenIndex(null);
  }

  const selectedBook = openIndex != null ? visible[openIndex] ?? null : null;
  const hasBooks = years.length > 0;

  const periodLabel =
    viewMode === "year"
      ? `${activeYear} · ${visible.length} book${visible.length === 1 ? "" : "s"}`
      : `${activeMonth} ${activeYear}`;

  return (
   <div
  className="min-h-screen w-full"
  style={{
    background:
      "radial-gradient(900px circle at 8% 6%, color-mix(in srgb, var(--moss) 40%, transparent), transparent 55%)," +
      "radial-gradient(900px circle at 92% 10%, color-mix(in srgb, var(--ink) 25%, transparent), transparent 55%)," +
      "radial-gradient(820px circle at 94% 98%, color-mix(in srgb, var(--rose) 30%, transparent), transparent 55%)," +
      "var(--paper)",
  }}
>
  <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-6 py-10">
       <header className="space-y-1">
        <div className="flex items-baseline justify-between">
          <h1 className="font-serif text-4xl font-normal tracking-tight text-ink">
            my shelf
          </h1>
          <Link
            href="/"
            className="text-sm text-deep transition-colors hover:text-ink"
          >
            ← start over
          </Link>
        </div>
        <p className="text-sm italic text-rose">
          a record of every book you’ve met
        </p>
      </header>

      <SourceBar source={source} />

      {isLoading ? (
        <p className="py-16 text-center text-sm text-deep">
          shelving your books…
        </p>
      ) : error ? (
        <p className="py-16 text-center text-sm text-rose">{error}</p>
      ) : !hasBooks ? (
        <div className="rounded-2xl bg-moss/12 px-5 py-12 text-center text-sm text-deep">
          no read books found in that export — head back and{" "}
          <Link href="/" className="underline hover:text-ink">
            upload another
          </Link>
          .
        </div>
      ) : (
        <>
          <Controls
            viewMode={viewMode}
            onViewModeChange={changeView}
            years={years}
            activeYear={activeYear}
            onYearChange={changeYear}
            months={months}
            activeMonth={activeMonth}
            onMonthChange={changeMonth}
          />

          <StatsRow
            booksRead={stats.booksRead}
            activeMonths={stats.activeMonths}
            avgRating={stats.avgRating}
          />

          <section>
            <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.1em] text-deep">
              {periodLabel}
            </p>

            <div className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div>
                <div className="flex items-end gap-[3px] px-1 pt-6">
                  {visible.map((book, i) => (
                    <BookSpine
                      key={`${book.title}-${book.dateISO}-${i}`}
                      book={book}
                      index={i}
                      flipped={openIndex === i}
                      onClick={() =>
                        setOpenIndex((current) => (current === i ? null : i))
                      }
                    />
                  ))}
                </div>
                <div
                  className="rounded-[3px]"
                  style={{
                    height: 10,
                    minWidth: "100%",
                    background: "var(--ink)",
                    boxShadow: "0 7px 10px -5px rgba(0,0,0,0.4)",
                  }}
                />
              </div>
            </div>

            <DetailPanel
              book={selectedBook}
              index={openIndex ?? 0}
              onClose={() => setOpenIndex(null)}
            />
          </section>
        </>
      )}
    </main>
    </div>
  );
}
