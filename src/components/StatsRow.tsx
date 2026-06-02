type StatsRowProps = {
  booksRead: number;
  activeMonths: number;
  avgRating: number | null;   // null when nothing in view is rated
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-moss/12 px-4 py-3">
      <p className="text-2xl font-medium text-ink">{value}</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-[0.08em] text-deep">
        {label}
      </p>
    </div>
  );
}

export function StatsRow({ booksRead, activeMonths, avgRating }: StatsRowProps) {
  return (
    <section className="grid grid-cols-3 gap-2">
      <Stat value={String(booksRead)} label="books read" />
      <Stat value={String(activeMonths)} label="active months" />
      <Stat
        value={avgRating != null ? avgRating.toFixed(1) : "–"}
        label="avg rating"
      />
    </section>
  );
}
