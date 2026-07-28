import { Link } from "react-router-dom";
import type { MovementItem } from "@utils/dashboard.utils";
import { formatCurrency } from "@utils/dashboard.utils";
import MoneyIcon from "@assets/moneyIcon.svg?react";

interface RecentMovementsCardProps {
  movements: MovementItem[];
}

function RecentMovementsCard({ movements }: RecentMovementsCardProps) {
  const displayItems = movements.slice(0, 5);

  return (
    <div className="bg-paper rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="px-5 pt-5 pb-3">
        <h3 className="font-display font-semibold text-ink text-base">
          &Uacute;ltimos movimientos
        </h3>
      </div>

      <div className="flex-1 px-5 pb-2">
        {displayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-slate">
            <p className="text-sm">Sin movimientos</p>
          </div>
        ) : (
          <div className="space-y-0">
            {displayItems.map((m, i) => (
              <div
                key={m.id}
                className={`flex items-center gap-3 py-2.5 ${
                  i < displayItems.length - 1
                    ? "border-b border-slate-100"
                    : ""
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    m.isIncome ? "bg-success/10" : "bg-danger/10"
                  }`}
                >
                  <MoneyIcon
                    className={`w-4 h-4 ${
                      m.isIncome ? "text-success" : "text-danger"
                    }`}
                  />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">
                    {m.description}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold font-display flex-shrink-0 ${
                    m.isIncome ? "text-success" : "text-danger"
                  }`}
                >
                  {m.isIncome ? "+" : "-"}
                  {formatCurrency(m.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 pb-4 pt-2">
        <Link
          to="/sales/payments"
          className="block text-center text-sm text-primary font-medium font-display hover:underline"
        >
          Ver todos
        </Link>
      </div>
    </div>
  );
}

export { RecentMovementsCard };
