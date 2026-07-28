import { Link } from "react-router-dom";
import type { AgendaItem } from "@utils/dashboard.utils";
import { getStateBadgeClass, stateLabel } from "@utils/dashboard.utils";

interface AgendaCardProps {
  items: AgendaItem[];
}

function AgendaCard({ items }: AgendaCardProps) {
  const displayItems = items.slice(0, 5);

  return (
    <div className="bg-paper rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <h3 className="font-display font-semibold text-ink text-base">
          Agenda de hoy
        </h3>
        <span className="text-xs text-slate bg-slate-100 px-2 py-0.5 rounded-full font-mono">
          {items.length} citas
        </span>
      </div>

      <div className="flex-1 px-5 pb-2">
        {displayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate">
            <p className="text-sm">Sin citas para hoy</p>
          </div>
        ) : (
          <div className="space-y-0">
            {displayItems.map((item, i) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 py-3 ${
                  i < displayItems.length - 1
                    ? "border-b border-slate-100"
                    : ""
                }`}
              >
                <span className="text-xs font-mono text-slate w-14 flex-shrink-0">
                  {item.time}
                </span>

                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    item.type === "medical" ? "bg-primary" : "bg-amber"
                  }`}
                />

                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold font-display ${
                    item.species === "CANINO"
                      ? "bg-amber/10 text-amber"
                      : "bg-violet-50 text-violet-500"
                  }`}
                >
                  {item.petName.charAt(0).toUpperCase()}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">
                    {item.petName}
                  </p>
                  <p className="text-xs text-slate truncate">
                    {item.description}
                  </p>
                </div>

                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${getStateBadgeClass(
                    item.state,
                  )}`}
                >
                  {stateLabel(item.state)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 pb-4 pt-2">
        <Link
          to="/clinic-queue"
          className="block text-center text-sm text-primary font-medium font-display hover:underline"
        >
          Ver todas las citas
        </Link>
      </div>
    </div>
  );
}

export { AgendaCard };
