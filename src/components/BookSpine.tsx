"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import type { Book } from "@/lib/types";
import { SPINE_BORDER, spineColor, spineHeight } from "@/lib/spines";

type BookSpineProps = {
  book: Book;
  index: number;       // position on the shelf → colour
  flipped: boolean;    // showing the cover face?
  onClick: () => void;
};

const SPINE_WIDTH = 36;

export function BookSpine({ book, index, flipped, onClick }: BookSpineProps) {
  const color = spineColor(index);
  /** storygraph doesn't expose num of pages -- fixing spine height for now */
  const height = spineHeight(book.pages);
  const [coverFailed, setCoverFailed] = useState(false);
  // Width follows the cover's real aspect ratio so it fills the face with no
  // letterboxing or cropping. Falls back to a typical book ratio until loaded.
  const [coverAspect, setCoverAspect] = useState(0.66);
  const showCover = book.cover && !coverFailed;
  const coverWidth = Math.min(200, Math.max(120, Math.round(height * coverAspect)));

  const faceBase: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    borderRadius: "2px 0px 0px 2px",
    overflow: "hidden",
  };

  return (
    <motion.button
      layout={false}
      type="button"
      onClick={onClick}
      aria-label={`${book.title} by ${book.author}`}
      aria-pressed={flipped}
      className="relative shrink-0 cursor-pointer rounded-[2px_4px_4px_2px] outline-none focus-visible:ring-2 focus-visible:ring-deep/60"
      initial={false}
      animate={{
        width: flipped ? coverWidth : SPINE_WIDTH,
        boxShadow: flipped
          ? "0 14px 28px -18px rgba(19, 37, 41, 0.75)"
          : "0 0 0 rgba(19, 37, 41, 0)",
      }}
      transition={{ type: "spring", stiffness: 240, damping: 24 }}
      style={{ height, perspective: 600 }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        {/* Front: coloured spine with rotated title */}
        <div
          style={{
            ...faceBase,
            background: color.bg,
            borderLeft: `4px solid ${SPINE_BORDER}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset -3px 0 6px rgba(0,0,0,0.18)",
          }}
        >
          <span
            className="px-0 py-2.5 text-center text-[11px] font-medium tracking-wide"
            style={{
              color: color.fg,
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {book.title}
          </span>
        </div>

        {/* Back: cover image, falling back to a coloured tile with the title */}
        <div
          style={{
            ...faceBase,
            transform: "rotateY(180deg)",
          }}
        >
          {showCover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.cover}
              alt={book.title}
              onError={() => setCoverFailed(true)}
              onLoad={(e) => {
                const img = e.currentTarget;
                if (img.naturalWidth && img.naturalHeight) {
                  setCoverAspect(img.naturalWidth / img.naturalHeight);
                }
              }}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center p-1.5"
              style={{ background: color.bg }}
            >
              <span
                className="text-center text-[9px] font-medium leading-tight"
                style={{ color: color.fg }}
              >
                {book.title}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.button>  );
}
