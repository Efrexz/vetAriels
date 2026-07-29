import type { ComponentType } from "react";
import ArrowUpIcon from "@assets/arrowUp.svg?react";
import ArrowDownIcon from "@assets/arrowDown.svg?react";

interface KpiCardProps {
  icon: ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  value: number;
  label: string;
  caption?: string;
  deltaText?: string;
}

function KpiCard({ icon: Icon, color, value, label, caption, deltaText }: KpiCardProps) {
  const isPositive = deltaText?.startsWith("↑");
  const isNegative = deltaText?.startsWith("↓");

  return (
    <div className="card p-4 sm:p-5 flex flex-col gap-2 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_-8px_rgb(15_23_42/0.12)] transition-all duration-200">
      <div className="flex items-center justify-between">
        <span
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: color + "1A" }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </span>
        {deltaText && (
          <span
            className={`pill-badge ${
              isPositive
                ? "bg-success/10 text-success"
                : isNegative
                  ? "bg-danger/10 text-danger"
                  : "bg-slate-100 text-slate"
            }`}
          >
            {isPositive ? (
              <ArrowUpIcon className="w-3 h-3" />
            ) : isNegative ? (
              <ArrowDownIcon className="w-3 h-3" />
            ) : null}
            <span>{deltaText.replace(/^[↑↓]\s?/, "")}</span>
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl sm:text-3xl font-bold font-display text-ink leading-none">
          {value}
        </p>
        <p className="text-[13px] text-slate mt-1">{label}</p>
        {caption && (
          <p className="text-xs text-slate mt-0.5">{caption}</p>
        )}
      </div>
    </div>
  );
}

export { KpiCard };
