import { useState, useEffect, ChangeEvent } from 'react';
import { InventoryOperation, PurchasedItem } from "@t/inventory.types";
import { useGlobal } from '@context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { ActionButtons } from '@components/ui/ActionButtons';
import { FormField } from '@components/ui/FormField';
import FileContract from '@assets/fileContract.svg?react';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import DocumentJoinIcon from '@assets/documentJoinIcon.svg?react';
import DocumentOutIcon from '@assets/documentOutIcon.svg?react';

type OperationMode = 'restock' | 'discharge';

interface EditOperationProps {
  typeOfOperation: OperationMode;
  operationData: InventoryOperation;
}

type FormDataState = {
  responsible: string;
  reason: string;
};

function EditOperation({ typeOfOperation, operationData }: EditOperationProps) {
  const { users } = useGlobal();
  const navigate = useNavigate();
  const isRestock = typeOfOperation === 'restock';

  const [formData, setFormData] = useState<FormDataState>({
    responsible: '',
    reason: '',
  });

  useEffect(() => {
    if (operationData) {
      setFormData({
        responsible: operationData.responsible || '',
        reason: operationData.reason || '',
      });
    }
  }, [operationData]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }

  function handleSave() {
    navigate(isRestock ? `/charges/charge/${operationData.id}/detail` : `/discharges/discharge/${operationData.id}/detail`);
  }

  const userOptions = users.map((u) => ({ value: u.name, label: u.name }));

  return (
    <section className="w-full mx-auto bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-slate-100">
          <FormField
            label="Responsable / Solicitante"
            id="responsible"
            as="select"
            icon={RoleUserIcon}
            value={formData.responsible}
            onChange={handleChange}
            options={userOptions}
          />
          <FormField
            label="Motivo"
            id="reason"
            icon={FileContract}
            value={formData.reason}
            onChange={handleChange}
            placeholder="Motivo de la operación"
          />
        </div>

        <div className="overflow-x-auto mt-6">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-slate">C&oacute;digo</th>
                <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Producto</th>
                {isRestock && <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">P. Venta</th>}
                <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Cantidad</th>
                <th className="py-3 px-3 text-right text-xs font-semibold uppercase tracking-wider text-slate">Total</th>
              </tr>
            </thead>
            <tbody>
              {operationData.products.map((product: PurchasedItem) => (
                <tr key={product.provisionalId} className="border-b border-slate-100 hover:bg-slate-50/60 text-sm">
                  <td className="py-3 px-4 text-center text-slate font-mono">{product.systemCode?.slice(0, 8).toUpperCase()}</td>
                  <td className="py-3 px-3 text-ink font-medium">{product.productName}</td>
                  {isRestock && <td className="py-3 px-3 text-center text-slate font-mono">S/ {product.salePrice?.toFixed(2) || '0.00'}</td>}
                  <td className="py-3 px-3 text-center text-slate">{product.quantity}</td>
                  <td className="py-3 px-3 text-right text-ink font-mono font-semibold">S/ {((product.cost || 0) * (product.quantity || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ActionButtons
        onCancel={() => navigate(-1)}
        onSubmit={handleSave}
        submitText="Guardar cambios"
        mode="form"
      />
    </section>
  );
}

export { EditOperation };
