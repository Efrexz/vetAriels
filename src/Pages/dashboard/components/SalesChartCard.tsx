import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency, formatDelta } from "@utils/dashboard.utils";
import type { SalesByHour } from "@utils/dashboard.utils";

interface SalesChartCardProps {
  total: number;
  deltaVsYesterday: number;
  byHour: SalesByHour[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-md text-sm">
        <p className="text-slate text-xs">
          {label}:00 hs
        </p>
        <p className="font-semibold text-ink">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}

function SalesChartCard({ total, deltaVsYesterday, byHour }: SalesChartCardProps) {
  const hasData = byHour.some((h) => h.total > 0);

  return (
    <div className="bg-paper rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full text-primary">
      <div className="px-5 pt-5 pb-1 flex items-start justify-between">
        <div>
          <p className="text-xs text-slate uppercase tracking-wider font-medium">
            Ventas del d&iacute;a
          </p>
          <p className="text-2xl md:text-3xl font-bold font-display text-ink mt-1 leading-none">
            {formatCurrency(total)}
          </p>
          {hasData && (
            <span
              className={`inline-block mt-1.5 text-xs font-medium ${
                deltaVsYesterday > 0
                  ? "text-success"
                  : deltaVsYesterday < 0
                    ? "text-danger"
                    : "text-slate"
              }`}
            >
              {formatDelta(deltaVsYesterday)} respecto a ayer
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 px-2 pb-3 min-h-[140px]">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={byHour}
              margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="currentColor" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E2E8F0"
                vertical={false}
              />
              <XAxis
                dataKey="hour"
                tickFormatter={(h: number) => `${h}h`}
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                axisLine={{ stroke: "#E2E8F0" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v: number) =>
                  v >= 1000 ? `S/.${(v / 1000).toFixed(1)}k` : `S/.${v}`
                }
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
                width={55}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="currentColor"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#salesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-slate text-sm">
            Sin ventas registradas hoy
          </div>
        )}
      </div>
    </div>
  );
}

export { SalesChartCard };
