import Link from "next/link";

import { SOURCE_LABELS, type Source } from "@/lib/types";

type SourceBarProps = {
  source?: Source;
};

export function SourceBar({ source }: SourceBarProps) {
  return (
    <section className="flex flex-wrap items-center gap-2 rounded-2xl bg-moss/12 px-4 py-2.5">
      <span className="text-[11px] uppercase tracking-[0.08em] text-deep">
        source
      </span>
      <span className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-paper">
        {source ? SOURCE_LABELS[source] : "sample"}
      </span>
      <Link
        href="/"
        className="ml-auto text-xs text-deep transition-colors hover:text-ink"
      >
        upload a different export →
      </Link>
    </section>
  );
}
