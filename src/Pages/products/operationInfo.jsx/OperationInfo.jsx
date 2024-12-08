import { useNavigate, useParams } from "react-router-dom";
import { ProductsAndServicesContext } from "@context/ProductsAndServicesContext";
import { OperationDetail } from "./OperationDetail";
import { EditOperation } from "./EditOperation";
import { HorizontalMenu } from "@components/HorizontalMenu";
import DocumentJoinIcon from "@assets/documentJoinIcon.svg?react";
import DocumentOutIcon from "@assets/documentOutIcon.svg?react"
import ReturnIcon from "@assets/returnIcon.svg?react";
import FileContract from '@assets/fileContract.svg?react';
import Lightbulb from '@assets/lightbulb.svg?react';
import PropTypes from "prop-types";
import { useContext } from "react";

function OperationInfo({ typeOfOperation }) {
    const navigate = useNavigate();
    const { section, id } = useParams();
    //obtenemos todos los datos de las cargas y descargas
    const { restockData, dischargesData } = useContext(ProductsAndServicesContext);

    //determinamos si la operación es una carga o descarga
    const isRestock = typeOfOperation === "restock";
    //de acuerdo a la operación buscamos el dato correspondiente y estos datos lo enviamos a los componentes con toda la informacion de esa operación
    const operationData = isRestock
        ? restockData.find((restock) => restock.id === Number(id))
        : dischargesData.find((discharge) => discharge.id === Number(id));

    //determinamos las categorías de las tablas dependiendo del tipo de operación y la pasamos al componente
    const restockTableCategories = [
        "Codigo de sistema",
        "Producto",
        "Precio Unitario de Compra",
        "Precio Unitario de Venta",
        "Cantidad",
        "Total Compra"
    ];

    const dischargeTableCategories = [
        "Codigo de sistema",
        "Producto",
        "Precio Unitario",
        "Cantidad",
        "Total"
    ];

    const tableCategories = typeOfOperation === "restock" ? restockTableCategories : dischargeTableCategories;


    return (
        <main className="w-full mx-auto p-6 bg-white ">
            <h2
                className={`text-2xl font-medium mb-4 border-b-2 border-gray-200 pb-3 flex items-center gap-2 ${typeOfOperation === "discharge" ? "text-red-400" : "text-green-400"
                    }`}
            >
                <span className="flex items-center gap-2">
                    {typeOfOperation === "discharge" ? (
                        <>
                            <DocumentJoinIcon className="w-6 h-6" />
                            <span>Descarga de stock #{id}</span>
                        </>
                    ) : (
                        <>
                            <DocumentOutIcon className="w-6 h-6" />
                            <span>Carga de stock #{id}</span>
                        </>
                    )}
                </span>
            </h2>
            <HorizontalMenu mode={typeOfOperation} />
            <section >
                {section === 'detail' && <OperationDetail typeOfOperation={typeOfOperation} operationData={operationData} tableCategories={tableCategories} />}
                {section === 'edit' && <EditOperation typeOfOperation={typeOfOperation} operationData={operationData} tableCategories={tableCategories} />}
                <div className='flex justify-between items-center gap-4 p-4 border-t border-gray-200 bg-gray-50 shadow-md text-sm'>
                    <button
                        className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 flex items-center gap-3"
                        onClick={() => navigate(`${typeOfOperation === "discharge" ? "/discharges" : "/charges"}`)}
                    >
                        <ReturnIcon className="w-5 h-5 text-gray-700" />
                        REGRESAR AL LISTADO DE {typeOfOperation === "discharge" ? "DESCARGAS" : "CARGAS"}
                    </button>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center gap-3"
                    >
                        <FileContract className="w-5 h-5 text-white" />
                        IMPRIMIR
                    </button>
                </div>
            </section>
            <div className="bg-orange-400 text-white p-4 rounded-md mt-6 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                {
                    typeOfOperation === "discharge" ? (
                        <p>Por seguridad los productos y cantidades de esta <span className="font-bold">descarga</span> no se pueden editar. Al hacerlo se corre el riesgo de fallas en el stock. Si deseas corregir algún producto cargado por error puedes hacer una rectificación desde la herramienta <span className="font-bold">cargar stock </span></p>
                    ) : (
                        <p>Por seguridad los productos y cantidades de esta <span className="font-bold">carga</span> no se pueden editar. Al hacerlo se corre el riesgo de fallas en el stock. Si deseas corregir algún producto cargado por error puedes hacer una rectificación desde la herramienta <span className="font-bold">descargar stock </span></p>
                    )
                }
            </div>
        </main>
    );
}

export { OperationInfo };

OperationInfo.propTypes = {
    typeOfOperation: PropTypes.string
}