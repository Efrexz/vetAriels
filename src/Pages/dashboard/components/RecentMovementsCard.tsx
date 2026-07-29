import { Link } from "react-router-dom";
import type { MovementItem } from "@utils/dashboard.utils";
import { formatCurrency, timeAgo } from "@utils/dashboard.utils";
import MoneyIcon from "@assets/moneyIcon.svg?react";

interface RecentMovementsCardProps {
  movements: MovementItem[];
}

function RecentMovementsCard({ movements }: RecentMovementsCardProps) {
  const displayItems = movements.slice(0, 5);

  return (
    <div className="card flex flex-col h-full">
      <div className="px-5 pt-5 pb-3">
        <h3 className="font-display font-semibold text-ink text-base">
          Actividad reciente
        </h3>
      </div>

      <div className="flex-1 px-5 pb-2">
        {displayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-slate">
            <p className="text-sm">Sin actividad</p>
          </div>
        ) : (
          <div className="space-y-0">
            {displayItems.map((m, i) => {
              const Icon = MoneyIcon;
              return (
                <div
                  key={m.id}
                  className={`flex items-center gap-3 py-3 ${
                    i < displayItems.length - 1
                      ? "border-b border-slate-100"
                      : ""
                  }`}
                >
                  <span
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      m.isIncome ? "bg-success/10" : "bg-danger/10"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        m.isIncome ? "text-success" : "text-danger"
                      }`}
                    />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">
                      {m.description}
                    </p>
                    <p className="text-[13px] text-slate truncate">
                      {m.isIncome ? "Ingreso" : "Egreso"}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span
                      className={`text-sm font-semibold font-display ${
                        m.isIncome ? "text-success" : "text-danger"
                      }`}
                    >
                      {m.isIncome ? "+" : "-"}
                      {formatCurrency(m.amount)}
                    </span>
                    <p className="text-xs text-slate mt-0.5">
                      {timeAgo(m.date)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Link to="/sales/payments" className="card-footer-btn">
        Ver todos los movimientos
        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

export { RecentMovementsCard };
