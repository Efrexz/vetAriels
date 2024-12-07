import { useNavigate, useParams } from "react-router-dom";
import { OperationDetail } from "./OperationDetail";
import { HorizontalMenu } from "../../components/HorizontalMenu";
import DocumentJoinIcon from "../../assets/documentJoinIcon.svg?react";
import DocumentOutIcon from "../../assets/documentOutIcon.svg?react"
import ReturnIcon from "../../assets/returnIcon.svg?react";
import FileContract from '../../assets/fileContract.svg?react';
import PropTypes from "prop-types";

function OperationInfo({ typeOfOperation }) {
    const navigate = useNavigate();
    const { section, id } = useParams();
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
                {section === 'detail' && <OperationDetail typeOfOperation={typeOfOperation} />}
                {/*section === 'prices' && <EditProductPrice productData={product} />} */}
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
        </main>
    );
}

export { OperationInfo };

OperationInfo.propTypes = {
    typeOfOperation: PropTypes.string
}