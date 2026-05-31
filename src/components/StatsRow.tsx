export function StatsRow() {
  return (
    <section className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <p className="text-sm text-zinc-500">Books read</p>
        <p className="text-2xl font-semibold text-zinc-900">0</p>
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <p className="text-sm text-zinc-500">Active months</p>
        <p className="text-2xl font-semibold text-zinc-900">0</p>
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <p className="text-sm text-zinc-500">Avg rating</p>
        <p className="text-2xl font-semibold text-zinc-900">-</p>
      </div>
    </section>
  );
}
