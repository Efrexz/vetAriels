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
        <main className="w-full mx-auto p-6 bg-white ">
            <h2 className={`text-xl md:text-3xl font-medium mb-4 border-b-2 border-gray-200 pb-3 flex items-center gap-2 ${isRestock ? "text-green-400" : "text-red-400"}`}>
                <span className="flex items-center gap-2">
                    {isRestock ? (
                        <>
                        <DocumentJoinIcon className="w-6 sm:w-9 h-6 sm:h-9" />
                        <span>Carga de stock #{operationId}</span>
                        </>
                    ) : (
                        <>
                        <DocumentOutIcon className="w-6 sm:w-9 h-6 sm:h-9" />
                        <span>Descarga de stock #{operationId}</span>
                        </>
                    )}
                </span>
            </h2>
            <HorizontalMenu mode={typeOfOperation} />
            <section >
                {section === 'detail' && <OperationDetail typeOfOperation={typeOfOperation} operationData={operationData} tableCategories={tableCategories} />}
                {section === 'edit' && <EditOperation typeOfOperation={typeOfOperation} operationData={operationData} tableCategories={tableCategories} />}
                <div className='flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-gray-200 bg-gray-50 shadow-md text-sm'>
                    <button
                        className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 flex items-center gap-3 w-full sm:w-auto"
                        onClick={() => navigate(isRestock ? "/charges" : "/discharges")}
                    >
                        <ReturnIcon className="w-5 h-5 text-gray-700" />
                        REGRESAR AL LISTADO DE {isRestock ? "CARGAS" : "DESCARGAS"}
                    </button>
                    <button className={`${section === "detail" ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"} text-white py-2 px-4 rounded hover:bg-opacity-80 flex items-center gap-3 w-full sm:w-auto`}
                    >
                        <FileContract className="w-5 h-5 text-white" />
                        {section === "detail" ? "IMPRIMIR" : "GUARDAR CAMBIOS"}
                    </button>
                </div>
            </section>
            <div className="bg-orange-50 text-orange-800 p-4 rounded-md mt-6 flex items-start border-l-4 border-orange-400">
                <Lightbulb className="w-5 h-5 mr-2" />
                <p className="text-sm">
                Por seguridad, los productos y cantidades de esta {isRestock ? "carga" : "descarga"} no se pueden editar. Al hacerlo se corre el riesgo de fallas en el stock. Si deseas corregir un producto por error, puedes hacer una rectificación desde la herramienta de {isRestock ? "descargar stock" : "cargar stock"}.
                </p>
            </div>
        </main>
    );
}

export { OperationInfo };
