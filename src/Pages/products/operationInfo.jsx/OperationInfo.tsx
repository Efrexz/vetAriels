import { useNavigate, useParams } from "react-router-dom";
import { useProductsAndServices } from "@context/ProductsAndServicesContext";
import { InventoryOperation } from "@t/inventory.types";
import { NotFound } from "@components/ui/NotFound";
import { OperationDetail } from "./OperationDetail";
import { EditOperation } from "./EditOperation";
import { HorizontalMenu } from "@components/ui/HorizontalMenu";
import { ActionButtons } from '@components/ui/ActionButtons';
import { InfoBanner } from '@components/ui/InfoBanner';
import DocumentJoinIcon from "@assets/documentJoinIcon.svg?react";
import DocumentOutIcon from "@assets/documentOutIcon.svg?react";

type OperationMode = 'restock' | 'discharge';

interface OperationInfoProps {
  typeOfOperation: OperationMode;
}

function OperationInfo({ typeOfOperation }: OperationInfoProps) {
  const { restockData, dischargesData } = useProductsAndServices();
  const navigate = useNavigate();
  const { section = 'detail', id: operationId } = useParams<{ id: string; section?: string }>();

  const isRestock = typeOfOperation === 'restock';
  const operationData: InventoryOperation | undefined = isRestock
    ? restockData.find((r) => r.id === operationId)
    : dischargesData.find((d) => d.id === operationId);

  if (!operationData) {
    return (
      <NotFound
        entityName={isRestock ? 'Carga de stock' : 'Descarga de stock'}
        searchId={operationId!}
        returnPath={isRestock ? '/charges' : '/discharges'}
      />
    );
  }

  const headerColor = isRestock ? '#059669' : '#E11D48';
  const HeaderIcon = isRestock ? DocumentJoinIcon : DocumentOutIcon;

  return (
    <main className="w-full">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <HeaderIcon className="w-7 h-7" style={{ color: headerColor }} />
          <div>
            <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
              Inventario
            </span>
            <h1 className="text-2xl font-bold font-display text-ink">
              {isRestock ? 'Carga' : 'Descarga'} de stock #{operationId}
            </h1>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <HorizontalMenu mode={typeOfOperation} />
      </div>

      <section>
        {section === 'detail' && <OperationDetail typeOfOperation={typeOfOperation} operationData={operationData} />}
        {section === 'edit' && <EditOperation typeOfOperation={typeOfOperation} operationData={operationData} />}

        <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
          <ActionButtons
            onCancel={() => navigate(isRestock ? '/charges' : '/discharges')}
            onSubmit={() => {}}
            cancelText={`Volver al listado de ${isRestock ? 'cargas' : 'descargas'}`}
            submitText={section === 'detail' ? 'Imprimir' : 'Guardar cambios'}
            mode="form"
          />
        </div>
      </section>

      <div className="mt-6">
        <InfoBanner type="warning">
          Por seguridad, los productos y cantidades de esta {isRestock ? 'carga' : 'descarga'} no se pueden editar. Al hacerlo se corre el riesgo de fallas en el stock. Si deseas corregir un producto por error, puedes hacer una rectificaci&oacute;n desde la herramienta de {isRestock ? 'descargar stock' : 'cargar stock'}.
        </InfoBanner>
      </div>
    </main>
  );
}

export { OperationInfo };
