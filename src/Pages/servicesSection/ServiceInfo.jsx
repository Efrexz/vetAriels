import { UpdateService } from "./UpdateService.jsx";
import { EditServicePrice } from "./EditServicePrice.jsx";
import { HorizontalMenu } from "../../components/HorizontalMenu.jsx";
import { useParams } from "react-router-dom";
import ReturnIcon from "../../assets/returnIcon.svg?react";
import PlusIcon from "../../assets/plusIcon.svg?react";

function ServiceInfo() {

    const { section } = useParams();

    return (
        <main className="w-full mx-auto p-6 bg-white">
            <h2 className="text-2xl font-medium mb-4 border-b-2 border-gray-200 pb-3 text-blue-400" >Promoción Vacuna Canino (SÉXTUPLE+KC)</h2>
            <HorizontalMenu mode={"service"} />
            <section >
                {section === 'update' && <UpdateService />}
                {section === 'prices' && <EditServicePrice />}
                <div className='flex justify-end items-center gap-4 p-4 border-t border-gray-200 bg-gray-50 shadow-md '>
                    <button
                        className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 flex items-center gap-3"
                    // onClick={() => navigate(-1)}
                    >
                        <ReturnIcon className="w-5 h-5 text-gray-700" />
                        REGRESAR
                    </button>
                    <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3"
                    // onClick={createNewPet}
                    >
                        <PlusIcon className="w-5 h-5 text-white" />
                        ACTUALIZAR SERVICIO
                    </button>
                </div>
            </section>
        </main>
    );
}

export { ServiceInfo };