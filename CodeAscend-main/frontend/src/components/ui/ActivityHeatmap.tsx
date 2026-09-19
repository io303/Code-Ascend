import { useMemo } from "react";

interface ActivityHeatmapProps {
  submissionHeatmap?: Record<string, number>;
}

export function ActivityHeatmap({ submissionHeatmap = {} }: ActivityHeatmapProps) {
  // Generate 52 weeks (364 days) of squares ending today
  const days = useMemo(() => {
    const list: { dateStr: string; count: number; dayOfWeek: number }[] = [];
    const today = new Date();
    
    for (let i = 363; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const count = submissionHeatmap[dateStr] || 0;
      list.push({ dateStr, count, dayOfWeek: d.getDay() });
    }
    return list;
  }, [submissionHeatmap]);

  const getColorClass = (count: number) => {
    if (count === 0) return "bg-arena-surface-subtle border-arena-border";
    if (count === 1) return "bg-arena-purple-verylight border-arena-purple-light";
    if (count <= 3) return "bg-arena-purple-light border-arena-purple/40";
    if (count <= 6) return "bg-arena-purple text-white border-arena-purple shadow-purple-sm";
    return "bg-emerald-500 text-white border-emerald-400 shadow-sm";
  };

  const totalSubmissions = Object.values(submissionHeatmap).reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="p-6 rounded-3xl border border-arena-border bg-white space-y-4 font-mono text-xs shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-arena-text text-base">365-Day Activity Heatmap</h3>
          <p className="text-arena-text-secondary text-xs font-sans">
            {totalSubmissions} submissions recorded across the past year
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-arena-text-secondary">
          <span>Less</span>
          <span className="h-3 w-3 rounded-md bg-arena-surface-subtle border border-arena-border" />
          <span className="h-3 w-3 rounded-md bg-arena-purple-verylight border border-arena-purple-light" />
          <span className="h-3 w-3 rounded-md bg-arena-purple-light border border-arena-purple/40" />
          <span className="h-3 w-3 rounded-md bg-arena-purple border border-arena-purple" />
          <span className="h-3 w-3 rounded-md bg-emerald-500 border border-emerald-400" />
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 min-w-[700px]">
          {days.map((day) => (
            <div
              key={day.dateStr}
              title={`${day.dateStr}: ${day.count} submission${day.count === 1 ? "" : "s"}`}
              className={`h-3.5 w-3.5 rounded-md border transition-transform hover:scale-125 hover:z-10 ${getColorClass(
                day.count
              )}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
