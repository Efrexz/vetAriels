import { useState, ChangeEvent } from 'react';
import { useProductsAndServices } from '@context/ProductsAndServicesContext';
import { useToast } from '@context/ToastContext';
import { Service } from '@t/inventory.types';
import { ActionButtons } from '@components/ui/ActionButtons';
import { FormField } from '@components/ui/FormField';
import DollarIcon from '@assets/dollarIcon.svg?react';
import PercentIcon from '@assets/percentIcon.svg?react';

interface EditServicePriceProps {
  serviceData: Service;
}

interface PriceFormData {
  valorVenta: string;
  impuestoPorcentaje: string;
  impuestoExonerado: boolean;
  impuestoMonto: string;
  precioVentaPublico: string;
  costoServicioSinImpuestos: string;
  costoServicioConImpuestos: string;
  porcentajeDescuento: string;
  margenBruto: string;
  margenUtilidad: string;
}

function EditServicePrice({ serviceData }: EditServicePriceProps) {
  const { updateServiceData } = useProductsAndServices();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PriceFormData>({
    valorVenta: String(serviceData.salePrice || ''),
    impuestoPorcentaje: '18',
    impuestoExonerado: false,
    impuestoMonto: serviceData.salePrice ? String(serviceData.salePrice * 0.18) : '',
    precioVentaPublico: String(serviceData.salePrice || ''),
    costoServicioSinImpuestos: String(serviceData.cost || ''),
    costoServicioConImpuestos: '',
    porcentajeDescuento: '0',
    margenBruto: '',
    margenUtilidad: '',
  });

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  }

  async function handleSave() {
    setIsSubmitting(true);
    try {
      await updateServiceData(serviceData.id, {
        cost: Number(formData.costoServicioSinImpuestos) || 0,
        salePrice: Number(formData.precioVentaPublico) || 0,
      });
      toast.success('Precios actualizados correctamente.');
      window.history.back();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo actualizar los precios.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 space-y-4">
        <FormField
          label="Valor de venta (no incluye impuestos)"
          id="valorVenta"
          type="number"
          icon={DollarIcon}
          value={formData.valorVenta}
          onChange={handleChange}
        />

        <div className="space-y-1">
          <FormField
            label="Impuesto a las ventas en porcentaje (%)"
            id="impuestoPorcentaje"
            type="number"
            icon={PercentIcon}
            value={formData.impuestoPorcentaje}
            onChange={handleChange}
          />
          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.impuestoExonerado}
              onChange={(e) => setFormData({ ...formData, impuestoExonerado: e.target.checked })}
              className="form-checkbox h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-slate">Exonerado de impuestos</span>
          </label>
        </div>

        <FormField
          label="Impuesto a las ventas monto"
          id="impuestoMonto"
          type="number"
          icon={DollarIcon}
          value={formData.impuestoMonto}
          onChange={handleChange}
          disabled
        />

        <FormField
          label="Precio de venta al público (incluido impuestos)"
          id="precioVentaPublico"
          type="number"
          icon={DollarIcon}
          value={formData.precioVentaPublico}
          onChange={handleChange}
        />

        <div className="space-y-1">
          <FormField
            label="Costo del servicio (no incluye impuestos)"
            id="costoServicioSinImpuestos"
            type="number"
            icon={DollarIcon}
            value={formData.costoServicioSinImpuestos}
            onChange={handleChange}
          />
          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input type="checkbox" className="form-checkbox h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
            <span className="text-sm text-slate">Exonerado de impuestos</span>
          </label>
        </div>

        <FormField
          label="Costo del servicio (incluye impuestos)"
          id="costoServicioConImpuestos"
          type="number"
          icon={DollarIcon}
          value={formData.costoServicioConImpuestos}
          onChange={handleChange}
        />

        <FormField
          label="Porcentaje máximo de descuento (%)"
          id="porcentajeDescuento"
          type="number"
          icon={PercentIcon}
          value={formData.porcentajeDescuento}
          onChange={handleChange}
        />

        <FormField
          label="Margen bruto"
          id="margenBruto"
          type="number"
          icon={DollarIcon}
          value={formData.margenBruto}
          onChange={handleChange}
          disabled
        />

        <FormField
          label="Margen de utilidad porcentual"
          id="margenUtilidad"
          type="number"
          icon={PercentIcon}
          value={formData.margenUtilidad}
          onChange={handleChange}
          disabled
        />
      </div>

      <ActionButtons
        onCancel={() => window.history.back()}
        onSubmit={handleSave}
        submitText={isSubmitting ? 'Guardando...' : 'Guardar precios'}
        mode="form"
        disabled={isSubmitting}
      />
    </div>
  );
}

export { EditServicePrice };
