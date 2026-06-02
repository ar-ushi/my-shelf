"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { Source } from "@/lib/types";

// sessionStorage keys the shelf reads after a CSV hand-off.
const CSV_DATA_KEY = "myshelf:csv";
const CSV_NAME_KEY = "myshelf:csvName";

// Soft twinkles scattered over the pond background — purely decorative.
const SPARKLES = [
  { top: "10%", left: "14%", size: 8, delay: "0s", dur: "3.5s" },
  { top: "22%", left: "82%", size: 5, delay: "0.6s", dur: "4.2s" },
  { top: "38%", left: "8%", size: 4, delay: "1.2s", dur: "3s" },
  { top: "60%", left: "90%", size: 7, delay: "0.3s", dur: "4.8s" },
  { top: "74%", left: "20%", size: 5, delay: "1.8s", dur: "3.6s" },
  { top: "84%", left: "70%", size: 9, delay: "0.9s", dur: "5s" },
  { top: "16%", left: "50%", size: 4, delay: "2.1s", dur: "4s" },
  { top: "52%", left: "60%", size: 5, delay: "1.5s", dur: "3.2s" },
];

export function LandingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState<Source>("goodreads");

  function goToShelf(source: Source, params: Record<string, string> = {}) {
    const query = new URLSearchParams({ source, ...params });
    router.push(`/shelf?${query.toString()}`);
  }

  function handleCSV(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        sessionStorage.setItem(CSV_DATA_KEY, reader.result as string);
        sessionStorage.setItem(CSV_NAME_KEY, file.name);
      } catch {
        // sessionStorage may be unavailable (private mode); the shelf can
        // still prompt for a re-upload, so we don't block navigation.
      }
      goToShelf(source);
    };
    reader.readAsText(file);
  }

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16"
      style={{
        background:
          "radial-gradient(900px circle at 15% 12%, var(--moss), transparent 45%)," +
          "radial-gradient(800px circle at 88% 98%, var(--rose), transparent 45%)," +
          "radial-gradient(700px circle at 30% 95%, var(--deep), transparent 50%)," +
          "linear-gradient(160deg, var(--ink) 0%, var(--ink) 55%, var(--ink) 100%)",
      }}
    >
      {/* dreamy blurred orbs, like light through lily pads */}
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-[#839958]/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-[#D3968C]/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[#F7F4D5]/15 blur-3xl" />

      {SPARKLES.map((sparkle) => (
        <span
          key={`${sparkle.top}-${sparkle.left}`}
          className="pointer-events-none absolute rounded-full bg-[#F7F4D5] animate-pulse"
          style={{
            top: sparkle.top,
            left: sparkle.left,
            width: sparkle.size,
            height: sparkle.size,
            animationDelay: sparkle.delay,
            animationDuration: sparkle.dur,
            boxShadow: "0 0 10px 2px rgba(247,244,213,0.7)",
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-2xl">
          <header className="mb-8 text-center">
          <h1 className="font-serif text-6xl font-normal tracking-tight text-rose drop-shadow-var(--moss)">
            my shelf
          </h1>
          <p className="mt-4 text-lg text-moss/90">
            hi there — let&rsquo;s build your bookshelf
          </p>
          <p className="mt-1 text-sm italic text-rose">
            a record of every book you&rsquo;ve met
          </p>
        </header>


        <section className="rounded-3xl border border-ink/40 bg-paper/95 p-7 shadow-[0_24px_70px_var(--ink)] backdrop-blur-md sm:p-8">
    
          <div className="text-center">
            <p className="mb-3 text-lg text-deep">
              upload your library and we&rsquo;ll shelve it for you
            </p>
            <div className="mx-auto mb-4 max-w-xs text-left">
              <label
                htmlFor="csv-source"
                className="mb-2 block text-xs font-semibold  tracking-[0.12em] text-deep"
              >
                Which export is this?
              </label>
              <select
                id="csv-source"
                value={source}
                onChange={(event) => setSource(event.target.value as Source)}
                className="w-full rounded-2xl border border-moss/45 bg-white/70 px-4 py-3 text-sm text-ink focus:border-deep focus:outline-none focus:ring-2 focus:ring-deep/20"
              >
                <option value="goodreads">Goodreads</option>
                <option value="storygraph">StoryGraph</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-2xl border border-rose bg-rose/15 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-rose/30"
            >
              upload a .csv file
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleCSV}
              className="hidden"
            />

          </div>

          <div className="mt-6 grid gap-4 text-left sm:grid-cols-2">
            <section className="rounded-2xl border border-ink/28 bg-white/45 p-4">
              <h3 className="text-sm font-semibold text-deep">
                Export Your Library · Goodreads
              </h3>
              <ol className="mt-3 list-inside list-decimal space-y-2 text-xs leading-5 text-deep/80 sm:text-sm">
                <li>
                  Go to <strong>My Books</strong>.
                </li>
                <li>
                  In the left sidebar, scroll to{" "}
                  <strong>Import and Export</strong>.
                </li>
                <li>
                  Under <strong>Export Your Library</strong>, choose{" "}
                  <strong>Export Library</strong>.
                </li>
                <li>
                  Refresh until the <strong>Download CSV</strong> link appears,
                  then upload that file here.
                </li>
              </ol>
            </section>

            <section className="rounded-2xl border border-moss/35 bg-moss/10 p-4">
              <h3 className="text-sm font-semibold text-ink">
                Export Your Library · StoryGraph
              </h3>
              <ol className="mt-3 list-inside list-decimal space-y-2 text-xs leading-5 text-ink/80 sm:text-sm">
                <li>
                  Open <strong>Manage Account</strong> from your profile menu.
                </li>
                <li>
                  Scroll to the <strong>Import and Export</strong> section.
                </li>
                <li>
                  Choose the option to <strong>export your data</strong> as a
                  CSV file.
                </li>
                <li>
                  Download the finished export, then upload the CSV here to
                  build your shelf.
                </li>
              </ol>
            </section>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-[#F7F4D5]/60">
          phase 1 · csv imports from your reading apps
        </p>
      </div>
    </main>
  );
}
