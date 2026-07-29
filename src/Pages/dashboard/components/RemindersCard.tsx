import { Link } from "react-router-dom";
import type { Reminder } from "@utils/dashboard.utils";
import { urgencyConfig } from "@utils/dashboard.utils";
import AlertIcon from "@assets/alertIcon.svg?react";
import BoxesIcon from "@assets/boxesIcon.svg?react";
import BagShoppingIcon from "@assets/bagShopping.svg?react";

const reminderIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  "low-stock": BoxesIcon,
  "active-accounts": BagShoppingIcon,
};

interface RemindersCardProps {
  reminders: Reminder[];
}

function RemindersCard({ reminders }: RemindersCardProps) {
  return (
    <div className="card flex flex-col h-full">
      <div className="px-5 pt-5 pb-3">
        <h3 className="font-display font-semibold text-ink text-base">
          Recordatorios importantes
        </h3>
      </div>

      <div className="flex-1 px-5 pb-2">
        {reminders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-slate">
            <p className="text-sm">Todo al d&iacute;a</p>
          </div>
        ) : (
          <div className="space-y-0">
            {reminders.map((r, i) => {
              const Icon = reminderIcons[r.id] || AlertIcon;
              const cfg = urgencyConfig[r.urgency];
              return (
                <div
                  key={r.id}
                  className={`flex items-center gap-3 py-3 ${
                    i < reminders.length - 1
                      ? "border-b border-slate-100"
                      : ""
                  }`}
                >
                  <span
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.iconClass}`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">
                      {r.title}
                    </p>
                    <p className="text-[13px] text-slate truncate">
                      {r.subtitle}
                    </p>
                  </div>
                  <span
                    className={`pill-badge flex-shrink-0 ${cfg.pillClass}`}
                  >
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Link
        to={reminders[0]?.path || "/products"}
        className="card-footer-btn"
      >
        Ver todos los recordatorios
        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

export { RemindersCard };
