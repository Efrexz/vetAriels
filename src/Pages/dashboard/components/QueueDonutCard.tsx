import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { QueueSegment } from "@utils/dashboard.utils";

interface QueueDonutCardProps {
  segments: QueueSegment[];
  total: number;
}

function QueueDonutCard({ segments, total }: QueueDonutCardProps) {
  const hasData = total > 0;

  return (
    <div className="card flex flex-col h-full">
      <div className="px-5 pt-5 pb-1">
        <h3 className="font-display font-semibold text-ink text-base">
          Mascotas en espera
        </h3>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-2">
        {hasData ? (
          <div className="flex items-center gap-4 w-full">
            <div className="relative w-28 h-28 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segments}
                    cx="50%"
                    cy="50%"
                    innerRadius={36}
                    outerRadius={52}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {segments.map((seg, i) => (
                      <Cell key={i} fill={seg.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload as QueueSegment;
                        return (
                          <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-md text-sm">
                            <p className="font-medium text-ink">{d.label}</p>
                            <p className="text-slate text-xs">
                              {d.value} mascota{d.value !== 1 ? "s" : ""}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold font-display text-ink">
                  {total}
                </span>
                <span className="text-[10px] text-slate leading-none">Total</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              {segments.map((seg, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-sm text-ink">{seg.label}</span>
                  <span className="text-sm font-semibold font-display text-ink ml-auto">
                    {seg.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate">Sin mascotas en espera</p>
        )}
      </div>

      <Link to="/clinic-queue" className="card-footer-btn">
        Ver todas las mascotas
        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

export { QueueDonutCard };
