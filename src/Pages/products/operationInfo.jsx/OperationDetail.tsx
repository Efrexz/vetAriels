import { InventoryOperation, PurchasedItem } from "@t/inventory.types";
import RoleUserIcon from "@assets/roleUserIcon.svg?react";
import BookIcon from '@assets/bookIcon.svg?react';

type OperationMode = 'restock' | 'discharge';

interface OperationDetailProps {
  typeOfOperation: OperationMode;
  operationData: InventoryOperation;
}

function OperationDetail({ typeOfOperation, operationData }: OperationDetailProps) {
  const isRestock = typeOfOperation === 'restock';
  const selectedProducts: PurchasedItem[] = operationData.products;

  const subtotal = selectedProducts.reduce(
    (acc, p) => acc + (p.cost || 0) * (p.quantity || 0), 0
  );

  return (
    <section className="w-full mx-auto bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
          <div className="flex gap-4 items-start">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <RoleUserIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1.5 text-sm">
              <span className="text-slate">Responsable:</span>
              <span className="font-medium text-ink">{operationData.responsible}</span>
              <span className="text-slate">Registrado por:</span>
              <span className="font-medium text-ink">{operationData.registeredBy}</span>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
              <BookIcon className="w-5 h-5 text-teal" />
            </div>
            <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1.5 text-sm">
              <span className="text-slate">Fecha:</span>
              <span className="font-medium text-ink">{operationData.date} {operationData.time}</span>
              <span className="text-slate">Motivo:</span>
              <span className="font-medium text-ink truncate max-w-[200px]" title={operationData.reason}>{operationData.reason}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mt-6">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-slate">C&oacute;digo</th>
                <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Producto</th>
                <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">P. Compra</th>
                {isRestock && <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">P. Venta</th>}
                <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Cantidad</th>
                <th className="py-3 px-3 text-right text-xs font-semibold uppercase tracking-wider text-slate">Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((product: PurchasedItem) => (
                <tr key={product.provisionalId} className="border-b border-slate-100 hover:bg-slate-50/60 text-sm">
                  <td className="py-3 px-4 text-center text-slate font-mono">{product.systemCode?.slice(0, 8).toUpperCase()}</td>
                  <td className="py-3 px-3 text-ink font-medium">{product.productName}</td>
                  <td className="py-3 px-3 text-center text-slate font-mono">S/ {product.cost?.toFixed(2) || '0.00'}</td>
                  {isRestock && <td className="py-3 px-3 text-center text-slate font-mono">S/ {product.salePrice?.toFixed(2) || '0.00'}</td>}
                  <td className="py-3 px-3 text-center text-slate">{product.quantity}</td>
                  <td className="py-3 px-3 text-right text-ink font-mono font-semibold">S/ {((product.cost || 0) * (product.quantity || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-50 p-4 border-t border-slate-200 text-sm">
        <div className="flex justify-between w-full max-w-sm ml-auto">
          <span className="text-slate">Subtotal:</span>
          <span className="font-medium text-ink">S/ {(subtotal - subtotal * 0.18).toFixed(2)}</span>
        </div>
        <div className="flex justify-between w-full max-w-sm ml-auto mt-1">
          <span className="text-slate">Impuestos (18%):</span>
          <span className="font-medium text-ink">S/ {(subtotal * 0.18).toFixed(2)}</span>
        </div>
        <div className="flex justify-between w-full max-w-sm ml-auto mt-2 pt-2 border-t border-slate-200 text-base font-display font-bold text-ink">
          <span>TOTAL:</span>
          <span>S/ {subtotal.toFixed(2)}</span>
        </div>
      </div>
    </section>
  );
}

export { OperationDetail };
