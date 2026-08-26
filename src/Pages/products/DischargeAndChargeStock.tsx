import { useState, ChangeEvent } from "react";
import { useNavigate } from 'react-router-dom';
import { useGlobal } from "@context/GlobalContext";
import { useProductsAndServices } from "@context/ProductsAndServicesContext";
import { Product, Service, PurchasedItem, InventoryOperation } from "@t/inventory.types";
import { User } from "@t/user.types";
import { QuantityCounter } from '@components/ui/QuantityCounter';
import { ProductSearchInput } from '@components/search/ProductSearchInput';
import { QuantityModificationModal } from '@components/modals/QuantityModificationModal';
import { generateUniqueId } from '@utils/idGenerator';
import { ActionButtons } from '@components/ui/ActionButtons';
import { FormField } from '@components/ui/FormField';
import { InfoBanner } from '@components/ui/InfoBanner';
import { StatsCard } from '@components/ui/StatsCard';
import { useToast } from '@context/ToastContext';
import DocumentOutIcon from '@assets/documentOutIcon.svg?react';
import DocumentJoinIcon from '@assets/documentJoinIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import BoxesIcon from '@assets/boxesIcon.svg?react';
import ShoppingCart from '@assets/shoppingCart.svg?react';

type OperationMode = 'discharge' | 'restock';

interface DischargeAndChargeStockProps {
  typeOfOperation: OperationMode;
}

type FormDataState = {
  requestor: string;
  reason: string;
  store: string;
  operationType: string;
};

type FormErrors = Partial<Record<keyof FormDataState | 'products', string>>;

function DischargeAndChargeStock({ typeOfOperation }: DischargeAndChargeStockProps) {
  const { addDischarge, addRestock } = useProductsAndServices();
  const { users, activeUser } = useGlobal();
  const navigate = useNavigate();
  const isRestock = typeOfOperation === 'restock';
  const { toast } = useToast();

  const [selectedProducts, setSelectedProducts] = useState<PurchasedItem[]>([]);
  const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<PurchasedItem | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const userOptions = users.map((user: User) => `${user.name} ${user.lastName}`);

  const [formData, setFormData] = useState<FormDataState>({
    requestor: userOptions[0] || '',
    reason: '',
    store: 'ALMACEN CENTRAL',
    operationType: 'Seleccione',
  });

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }

  function addProductToTable(item: Product | Service) {
    const newProduct: PurchasedItem = {
      ...item,
      provisionalId: generateUniqueId(),
      quantity: 1,
      additionDate: new Date().toLocaleDateString(),
      additionTime: new Date().toLocaleTimeString(),
    };
    setSelectedProducts((prev) => [...prev, newProduct]);
  }

  function updateProductQuantity(provisionalId: string, newQuantity: number) {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.provisionalId === provisionalId ? { ...p, quantity: newQuantity } : p))
    );
  }

  function removeProduct(provisionalId: string) {
    setSelectedProducts((prev) => prev.filter((p) => p.provisionalId !== provisionalId));
  }

  function validateForm() {
    const newErrors: FormErrors = {};
    if (formData.reason.trim().length < 4) {
      newErrors.reason = 'El motivo debe tener al menos 4 caracteres';
    }
    if (!formData.operationType || formData.operationType === 'Seleccione') {
      newErrors.operationType = 'Debe seleccionar un tipo de operación válido';
    }
    if (selectedProducts.length === 0) {
      newErrors.products = 'Debe seleccionar al menos un producto';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

async function submitOrder() {
        if (!validateForm()) { toast.error("Corrige los errores del formulario"); return; }
        const newOrder: InventoryOperation = {
            id: '',
            date: '',
            time: '',
            reason: formData.reason.trim(),
            responsible: formData.requestor,
            registeredBy: `${activeUser?.name} ${activeUser?.lastName}` || 'Usuario Desconocido',
            operationType: isRestock ? 'CARGA' : 'DESCARGA',
            store: formData.store,
            products: selectedProducts,
        };
        try {
            if (isRestock) {
                await addRestock(newOrder);
                toast.success('Stock cargado correctamente.');
                navigate('/charges');
            } else {
                await addDischarge(newOrder);
                toast.success('Stock descargado correctamente.');
                navigate('/discharges');
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'No se pudo registrar la operacion.';
            toast.error(message);
        }
    }

  const headerColor = isRestock ? '#059669' : '#E11D48';
  const HeaderIcon = isRestock ? DocumentJoinIcon : DocumentOutIcon;
  const title = isRestock ? 'Cargar Stock' : 'Descargar Stock';

  return (
    <section className="w-full">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <HeaderIcon className="w-7 h-7" style={{ color: headerColor }} />
          <div>
            <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
              Inventario
            </span>
            <h1 className="text-2xl font-bold font-display text-ink">{title}</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <StatsCard icon={BoxesIcon} value={selectedProducts.length} label="Productos en lista" color={headerColor} />
        <StatsCard icon={ShoppingCart} value={selectedProducts.reduce((s, p) => s + (p.quantity || 0), 0)} label="Unidades totales" color="#3B82F6" />
        <StatsCard icon={isRestock ? DocumentJoinIcon : DocumentOutIcon} value={0} label="Operaciones hoy" color="#D97706" />
      </div>

      <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-sm font-semibold font-display text-ink mb-4">Datos de la operaci&oacute;n</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Responsable / Solicitante"
            id="requestor"
            as="select"
            icon={RoleUserIcon}
            value={formData.requestor}
            onChange={handleChange}
            options={userOptions.map((u) => ({ value: u, label: u }))}
          />
          <FormField
            label="Almacén"
            id="store"
            as="select"
            icon={BoxesIcon}
            value={formData.store}
            onChange={handleChange}
            options={['ALMACEN CENTRAL', 'VET ARIEL'].map((s) => ({ value: s, label: s }))}
          />
          <div className="md:col-span-2">
            <FormField
              label="Motivo"
              id="reason"
              icon={isRestock ? DocumentJoinIcon : DocumentOutIcon}
              value={formData.reason}
              onChange={handleChange}
              error={errors.reason}
              required
              placeholder="Describa el motivo de la operación"
            />
          </div>
          <div className="md:col-span-2">
            <FormField
              label="Tipo de Operación"
              id="operationType"
              as="select"
              icon={isRestock ? DocumentJoinIcon : DocumentOutIcon}
              value={formData.operationType}
              onChange={handleChange}
              error={errors.operationType}
              options={[
                { value: 'Seleccione', label: 'Seleccione tipo...' },
                { value: 'Ajuste por diferencia de inventario', label: 'Ajuste por diferencia de inventario' },
                { value: 'Devolución de productos', label: 'Devolución de productos' },
                { value: 'Donación', label: 'Donación' },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-slate-100">
          <label className="block text-sm font-medium text-ink mb-2">
            Buscar y agregar productos a la lista:
          </label>
          <ProductSearchInput addProductToTable={addProductToTable} mode={typeOfOperation} stockMode={true} />
          {errors.products && <p className="text-danger text-xs mt-2">{errors.products}</p>}
        </div>

        {selectedProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-slate">C&oacute;digo</th>
                  <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Producto</th>
                  <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">P. Compra</th>
                  <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">P. Venta</th>
                  <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Cant. {isRestock ? 'Cargar' : 'Descargar'}</th>
                  <th className="py-3 pr-4 pl-2 w-10" />
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product) => (
                  <tr key={product.provisionalId} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors text-sm">
                    <td className="py-3 px-4 text-center text-slate font-mono">{product.systemCode?.slice(0, 8).toUpperCase()}</td>
                    <td className="py-3 px-3 text-ink font-medium">{product.productName}</td>
                    <td className="py-3 px-3 text-center text-slate font-mono">S/ {product.cost?.toFixed(2) || '0.00'}</td>
                    <td className="py-3 px-3 text-center text-slate font-mono">S/ {product.salePrice?.toFixed(2) || '0.00'}</td>
                    <td className="py-3 px-3 text-center">
                      <QuantityCounter
                        itemCount={product.quantity}
                        changeQuantity={(qty) => updateProductQuantity(product.provisionalId, qty)}
                        maxQuantity={product.availableStock}
                        mode={typeOfOperation}
                        openQuantityModal={() => { setIsQuantityModalOpen(true); setProductToEdit(product); }}
                      />
                    </td>
                    <td className="py-3 pr-4 pl-2">
                      <button onClick={() => removeProduct(product.provisionalId)} className="p-1.5 rounded-lg text-slate hover:text-danger hover:bg-danger/10 transition-colors">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-slate text-sm">
            Agrega productos usando el buscador
          </div>
        )}
      </div>

      <div className="mb-6">
        <InfoBanner type="info">
          Puedes usar esta herramienta para {isRestock ? 'cargar' : 'descargar'} el stock de productos directamente.
        </InfoBanner>
      </div>

      <ActionButtons
        onCancel={() => navigate(-1)}
        onSubmit={submitOrder}
        submitText={isRestock ? 'Cargar stock' : 'Descargar stock'}
        mode="modal"
      />

      {isQuantityModalOpen && productToEdit && (
        <QuantityModificationModal
          quantity={productToEdit.quantity}
          changeQuantity={(qty) => updateProductQuantity(productToEdit.provisionalId, qty)}
          maxQuantity={productToEdit.availableStock}
          mode={typeOfOperation}
          onClose={() => setIsQuantityModalOpen(false)}
        />
      )}
    </section>
  );
}

export { DischargeAndChargeStock };
