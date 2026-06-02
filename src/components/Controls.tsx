"use client";

import type { MonthKey, ViewMode } from "@/lib/types";

type ControlsProps = {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  years: string[];
  activeYear: string;
  onYearChange: (year: string) => void;
  months: MonthKey[];        // only months that have books in the active year
  activeMonth: MonthKey;
  onMonthChange: (month: MonthKey) => void;
};

const VIEW_LABELS: Record<ViewMode, string> = {
  month: "by month",
  year: "by year",
};

function pillClass(active: boolean): string {
  return [
    "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
    active
      ? "bg-ink text-paper"
      : "bg-transparent text-deep hover:text-ink",
  ].join(" ");
}

export function Controls({
  viewMode,
  onViewModeChange,
  years,
  activeYear,
  onYearChange,
  months,
  activeMonth,
  onMonthChange,
}: ControlsProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* view toggle */}
        <div className="flex gap-1 rounded-full bg-moss/15 p-1">
          {(["month", "year"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onViewModeChange(mode)}
              className={pillClass(viewMode === mode)}
            >
              {VIEW_LABELS[mode]}
            </button>
          ))}
        </div>

        {/* year dropdown — only in month view */}
        {viewMode === "month" && years.length > 0 && (
          <select
            value={activeYear}
            onChange={(event) => onYearChange(event.target.value)}
            className="rounded-full border border-moss/40 bg-paper px-3 py-1.5 text-xs text-ink focus:border-deep focus:outline-none"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* month pills — only in month view, only months with books */}
      {viewMode === "month" && months.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {months.map((month) => (
            <button
              key={month}
              type="button"
              onClick={() => onMonthChange(month)}
              className={pillClass(month === activeMonth)}
            >
              {month}
            </button>
          ))}
        </div>
      )}

      {/* year pills — only in year view, only years with books */}
      {viewMode === "year" && years.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => onYearChange(year)}
              className={pillClass(year === activeYear)}
            >
              {year}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
