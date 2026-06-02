"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { Book } from "@/lib/types";
import { type SpineColor, spineColor } from "@/lib/spines";

type DetailPanelProps = {
  book: Book | null;
  index: number;        // colour follows the spine that was opened
  onClose: () => void;
};


function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < filled ? "text-rose" : "text-ink/20"}
          style={{ fontSize: 13 }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function CoverThumb({ book, color }: { book: Book; color: SpineColor }) {
  const [failed, setFailed] = useState(false);
  if (book.cover && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={book.cover}
        alt={book.title}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <div
      className="flex h-full w-full items-center justify-center p-1.5 text-center text-[9px] font-medium leading-tight"
      style={{ background: color.bg, color: color.fg }}
    >
      {book.title}
    </div>
  );
}

export function DetailPanel({ book, index, onClose }: DetailPanelProps) {
  const color = spineColor(index);
  console.log(book);
  return (
    <AnimatePresence initial={false}>
      {book && (
        <motion.div
          key={book.dateISO + book.title}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div
            className="mt-3 flex gap-4 rounded-r-2xl bg-moss/12 p-5"
            style={{ borderLeft: `4px solid var(--ink)` }}
          >
            <div
              className="h-[104px] w-[72px] shrink-0 overflow-hidden rounded-[2px_5px_5px_2px]"
            >
              <CoverThumb book={book} color={color} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-lg font-normal leading-tight text-ink">
                {book.title}
              </h3>
              {book.author && (
                <p className="mt-0.5 text-xs text-deep">{book.author}</p>
              )}

              {(book.tags.length > 0 || book.moods.length > 0) && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {book.tags.map((tag) => (
                    <span
                      key={`g-${tag}`}
                      className="rounded-lg bg-ink px-2 py-0.5 text-[10px] text-paper"
                    >
                      {tag}
                    </span>
                  ))}
                  {book.moods.map((mood) => (
                    <span
                      key={`m-${mood}`}
                      className="rounded-lg bg-rose/30 px-2 py-0.5 text-[10px] text-ink"
                    >
                      {mood}
                    </span>
                  ))}
                </div>
              )}

              {book.rating > 0 && (
                <div className="mt-2">
                  <Stars rating={book.rating} />
                </div>
              )}

              {book.review && (
                <p className="mt-2 border-t border-moss/30 pt-2 text-xs italic leading-relaxed text-ink/90">
                  “{book.review}”
                </p>
              )}

              <p className="mt-1.5 text-[11px] text-deep/80">
                finished {book.date}
                {book.pages > 0 ? ` · ${book.pages} pages` : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close details"
              className="ml-auto shrink-0 self-start text-deep/70 transition-colors hover:text-ink"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
