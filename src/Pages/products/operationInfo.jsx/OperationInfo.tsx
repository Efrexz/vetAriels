import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProductsAndServices } from "@context/ProductsAndServicesContext";
import { InventoryOperation } from "@t/inventory.types";
import { NotFound } from "@components/ui/NotFound";
import { OperationDetail } from "./OperationDetail";
import { EditOperation } from "./EditOperation";
import { HorizontalMenu } from "@components/ui/HorizontalMenu";
import DocumentJoinIcon from "@assets/documentJoinIcon.svg?react";
import DocumentOutIcon from "@assets/documentOutIcon.svg?react"
import ReturnIcon from "@assets/returnIcon.svg?react";
import FileContract from '@assets/fileContract.svg?react';
import Lightbulb from '@assets/lightbulb.svg?react';

type OperationMode = 'restock' | 'discharge';

interface OperationInfoProps {
    typeOfOperation: OperationMode;
}

function OperationInfo({ typeOfOperation }: OperationInfoProps) {

    const { restockData, dischargesData } = useProductsAndServices();
    const navigate = useNavigate();
    const { section = 'detail', id: operationId } = useParams<{ id: string; section?: string }>();

    const isRestock = typeOfOperation === "restock";
    const operationData: InventoryOperation | undefined = isRestock
        ? restockData.find((restock) => restock.id === operationId)
        : dischargesData.find((discharge) => discharge.id === operationId);

    if (!operationData) {
        const entityName = isRestock ? "Carga de stock" : "Descarga de stock";
        const returnPath = isRestock ? "/charges" : "/discharges";
        return (
        <NotFound
            entityName={entityName}
            searchId={operationId!}
            returnPath={returnPath}
        />
        );
    }

    const restockTableCategories = ["Código de sistema", "Producto", "Precio Compra", "Precio Venta", "Cantidad", "Total Compra"];
    const dischargeTableCategories = ["Código de sistema", "Producto", "Precio Unitario", "Cantidad", "Total"];
    const tableCategories = isRestock ? restockTableCategories : dischargeTableCategories;


    return (
        <main className="w-full p-1 md:p-6 bg-mist text-ink">
            <h2 className={`text-xl md:text-2xl font-medium mb-4 border-b-2 border-slate-200 pb-4 flex items-center gap-2`}>
                <span className="flex items-center gap-2">
                    {isRestock ? (
                        <>
                        <DocumentJoinIcon className="w-6 sm:w-9 h-6 sm:h-9 text-emerald-500" />
                        <span className="text-emerald-500">Carga de stock #{operationId}</span>
                        </>
                    ) : (
                        <>
                        <DocumentOutIcon className="w-6 sm:w-9 h-6 sm:h-9 text-rose-600" />
                        <span className="text-rose-600">Descarga de stock #{operationId}</span>
                        </>
                    )}
                </span>
            </h2>
            <HorizontalMenu mode={typeOfOperation} />
            <section>
                {section === 'detail' && <OperationDetail typeOfOperation={typeOfOperation} operationData={operationData} tableCategories={tableCategories} />}
                {section === 'edit' && <EditOperation typeOfOperation={typeOfOperation} operationData={operationData} tableCategories={tableCategories} />}
                <div className='flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-slate-200 bg-paper shadow-sm text-sm'>
                    <button
                        className="bg-paper border border-slate-200 text-slate py-1.5 px-4 rounded-lg hover:bg-slate-100 flex items-center gap-3 w-full sm:w-auto transition-colors"
                        onClick={() => navigate(isRestock ? "/charges" : "/discharges")}
                    >
                        <ReturnIcon className="w-5 h-5 text-slate" />
                        Regresar al listado de {isRestock ? "cargas" : "descargas"}
                    </button>
                    <button className={`${section === "detail" ? "bg-primary hover:opacity-90" : "bg-primary hover:opacity-90"} text-white py-1.5 px-4 rounded-lg font-semibold font-display shadow-sm shadow-primary/25 flex items-center gap-3 w-full sm:w-auto transition-colors`}
                    >
                        <FileContract className="w-5 h-5 text-white" />
                        {section === "detail" ? "Imprimir" : "Guardar cambios"}
                    </button>
                </div>
            </section>
            <div className="bg-paper text-slate p-4 rounded-md mt-6 flex items-start border-l-4 border-amber bg-amber/10">
                <Lightbulb className="w-5 h-5 mr-2" />
                <p className="text-sm">
                    Por seguridad, los productos y cantidades de esta {isRestock ? "carga" : "descarga"} no se pueden editar. Al hacerlo se corre el riesgo de fallas en el stock. Si deseas corregir un producto por error, puedes hacer una rectificación desde la herramienta de {isRestock ? "descargar stock" : "cargar stock"}.
                </p>
            </div>
        </main>
    );
}

export { OperationInfo };
