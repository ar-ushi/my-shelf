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
  const [username, setUsername] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function goToShelf(source: Source, params: Record<string, string> = {}) {
    const query = new URLSearchParams({ source, ...params });
    router.push(`/shelf?${query.toString()}`);
  }

  function handleStorygraph(event: React.FormEvent) {
    event.preventDefault();
    const handle = username.trim();
    if (!handle) return;
    goToShelf("storygraph", { username: handle });
  }

  function handleCSV(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        sessionStorage.setItem(CSV_DATA_KEY, String(reader.result ?? ""));
        sessionStorage.setItem(CSV_NAME_KEY, file.name);
      } catch {
        // sessionStorage may be unavailable (private mode); the shelf can
        // still prompt for a re-upload, so we don't block navigation.
      }
      goToShelf("csv");
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
          "radial-gradient(700px circle at 70% 95%, var(--deep), transparent 50%)," +
          "linear-gradient(160deg, var(--ink) 0%, var(--ink) 55%, var(--ink) 100%)",
      }}
    >
      {/* dreamy blurred orbs, like light through lily pads */}
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-[#839958]/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-[#D3968C]/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[#F7F4D5]/15 blur-3xl" />

      {/* twinkling sparkles */}
      {/* {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="pointer-events-none absolute rounded-full bg-[#F7F4D5] animate-pulse"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.dur,
            boxShadow: "0 0 10px 2px rgba(247,244,213,0.7)",
          }}
        />
      ))} */}

      <div className="relative z-10 w-full max-w-md">
        <header className="mb-8 text-center">
          <h1 className="font-serif text-6xl font-normal tracking-tight text-rose drop-shadow-[0_2px_24px_rgba(247,244,213,0.35)]">
            my shelf
          </h1>
          <p className="mt-4 text-lg text-moss/90">
            hi there — let&rsquo;s build your bookshelf
          </p>
          <p className="mt-1 text-sm italic text-rose">
            a record of every book you&rsquo;ve met
          </p>
        </header>

        <section className="rounded-3xl border border-[#F7F4D5]/40 bg-[#F7F4D5]/95 p-7 shadow-[0_24px_70px_rgba(10,51,35,0.45)] backdrop-blur-md">
          <form onSubmit={handleStorygraph}>
            <label
              htmlFor="storygraph-username"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#105666]"
            >
              got a storygraph account?
            </label>
            <input
              id="storygraph-username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="add your username to get started"
              autoComplete="off"
              className="w-full rounded-2xl border border-[#839958]/55 bg-white/70 px-4 py-3 text-sm text-[#0A3323] placeholder:text-[#839958] focus:border-[#105666] focus:outline-none focus:ring-2 focus:ring-[#105666]/25"
            />
            <button
              type="submit"
              disabled={!username.trim()}
              className="mt-3 w-full rounded-2xl bg-[#0A3323] px-4 py-3 text-sm font-medium text-[#F7F4D5] shadow-sm transition-all hover:bg-[#105666] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              build my shelf →
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-[#839958]">
            <span className="h-px flex-1 bg-[#839958]/35" />
            no storygraph? no problem
            <span className="h-px flex-1 bg-[#839958]/35" />
          </div>

          <div className="text-center">
            <p className="mb-3 text-sm text-[#105666]">
              upload your goodreads export and we&rsquo;ll shelve it for you
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#D3968C] bg-[#D3968C]/15 px-5 py-2.5 text-sm font-medium text-[#0A3323] transition-colors hover:bg-[#D3968C]/30"
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
        </section>

        <p className="mt-6 text-center text-xs text-[#F7F4D5]/60">
          phase 1 · storygraph &amp; goodreads csv
        </p>
      </div>
    </main>
  );
}
