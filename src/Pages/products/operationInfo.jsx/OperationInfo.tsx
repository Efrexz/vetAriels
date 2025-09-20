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

    //obtenemos todos los datos de las cargas y descargas
    const { restockData, dischargesData } = useProductsAndServices();
    const navigate = useNavigate();
    const { section = 'detail', id: operationId } = useParams<{ id: string; section?: string }>();

    //determinamos si la operación es una carga o descarga
    const isRestock = typeOfOperation === "restock";
    //de acuerdo a la operación buscamos el dato correspondiente y estos datos lo enviamos a los componentes con toda la informacion de esa operación
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

    //determinamos las categorías de las tablas dependiendo del tipo de operación y la pasamos al componente
    const restockTableCategories = ["Código de sistema", "Producto", "Precio Compra", "Precio Venta", "Cantidad", "Total Compra"];
    const dischargeTableCategories = ["Código de sistema", "Producto", "Precio Unitario", "Cantidad", "Total"];
    const tableCategories = isRestock ? restockTableCategories : dischargeTableCategories;


    return (
        <main className="w-full mx-auto p-6 bg-gray-950 text-gray-200">
            <h2 className={`text-xl md:text-3xl font-medium mb-4 border-b-2 border-gray-700 pb-3 flex items-center gap-2`}>
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
                <div className='flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-gray-700 bg-gray-900 shadow-xl text-sm'>
                    <button
                        className="bg-gray-800 border border-gray-700 text-gray-400 py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center gap-3 w-full sm:w-auto transition-colors"
                        onClick={() => navigate(isRestock ? "/charges" : "/discharges")}
                    >
                        <ReturnIcon className="w-5 h-5 text-gray-400" />
                        REGRESAR AL LISTADO DE {isRestock ? "CARGAS" : "DESCARGAS"}
                    </button>
                    <button className={`${section === "detail" ? "bg-cyan-600 hover:bg-cyan-700" : "bg-emerald-600 hover:bg-emerald-700"} text-white py-2 px-4 rounded-lg hover:bg-opacity-80 flex items-center gap-3 w-full sm:w-auto transition-colors`}
                    >
                        <FileContract className="w-5 h-5 text-white" />
                        {section === "detail" ? "IMPRIMIR" : "GUARDAR CAMBIOS"}
                    </button>
                </div>
            </section>
            <div className="bg-gray-800 text-gray-400 p-4 rounded-md mt-6 flex items-start border-l-4 border-yellow-500 bg-yellow-900/40">
                <Lightbulb className="w-5 h-5 mr-2" />
                <p className="text-sm">
                    Por seguridad, los productos y cantidades de esta {isRestock ? "carga" : "descarga"} no se pueden editar. Al hacerlo se corre el riesgo de fallas en el stock. Si deseas corregir un producto por error, puedes hacer una rectificación desde la herramienta de {isRestock ? "descargar stock" : "cargar stock"}.
                </p>
            </div>
        </main>
    );
}

export { OperationInfo };
