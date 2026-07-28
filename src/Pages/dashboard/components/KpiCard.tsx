import type { ComponentType } from "react";

interface KpiCardProps {
  icon: ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  value: number;
  label: string;
  deltaText?: string;
}

function KpiCard({ icon: Icon, color, value, label, deltaText }: KpiCardProps) {
  return (
    <div className="bg-paper rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: color + "1A" }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </span>
      </div>
      <div>
        <p className="text-2xl sm:text-3xl font-bold font-display text-ink leading-none">
          {value}
        </p>
        <p className="text-xs text-slate mt-1">{label}</p>
      </div>
      {deltaText && (
        <span
          className={`text-xs font-medium mt-0.5 ${
            deltaText.startsWith("↑")
              ? "text-success"
              : deltaText.startsWith("↓")
                ? "text-danger"
                : "text-slate"
          }`}
        >
          {deltaText}
        </span>
      )}
    </div>
  );
}

export { KpiCard };
