import { Link } from "react-router-dom";
import type { Product } from "@t/inventory.types";
import BoxesIcon from "@assets/boxesIcon.svg?react";

interface LowStockCardProps {
  products: Product[];
}

function LowStockCard({ products }: LowStockCardProps) {
  const displayItems = products.slice(0, 5);

  return (
    <div className="bg-paper rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <h3 className="font-display font-semibold text-ink text-base">
          Productos bajos
        </h3>
        <span className="text-xs text-danger bg-danger/10 px-2 py-0.5 rounded-full font-medium">
          {products.length}
        </span>
      </div>

      <div className="flex-1 px-5 pb-2">
        {displayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-slate">
            <p className="text-sm">Stock suficiente</p>
          </div>
        ) : (
          <div className="space-y-0">
            {displayItems.map((p, i) => (
              <div
                key={p.id}
                className={`flex items-center gap-3 py-2.5 ${
                  i < displayItems.length - 1
                    ? "border-b border-slate-100"
                    : ""
                }`}
              >
                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BoxesIcon className="w-4 h-4 text-primary" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">
                    {p.productName || "Producto"}
                  </p>
                </div>
                <span className="text-sm font-semibold font-mono text-ink flex-shrink-0">
                  {p.availableStock}{" "}
                  <span className="text-xs text-slate font-normal">un.</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 pb-4 pt-2">
        <Link
          to="/products"
          className="block text-center text-sm text-primary font-medium font-display hover:underline"
        >
          Ver todos
        </Link>
      </div>
    </div>
  );
}

export { LowStockCard };
