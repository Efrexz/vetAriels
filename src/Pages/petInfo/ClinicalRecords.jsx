import { useNavigate, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { ClientsContext } from '../../context/ClientsContext';
import ScaleBalanced from '@assets/scaleBalanced.svg?react';
import HeartPulse from '@assets/heartPulse.svg?react';
import Temperature from '@assets/temperature.svg?react';
import FileContratIcon from '@assets/fileContract.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import Stethoscope from '@assets/stethoscope.svg?react';
import FileContract from '@assets/fileContract.svg?react';


function ClinicalRecords() {
    const { petsData } = useContext(ClientsContext); // Contexto para los datos de las mascotas
    const { id } = useParams(); // Obtener el id del animal
    const navigate = useNavigate();

    // Encontrar los datos de la mascota específica
    const individualPetData = petsData.find(pet => pet.hc === id);

    const { records } = individualPetData;

    const physiologicalIcons = {
        temperature: Temperature,
        heartRate: HeartPulse,
        weight: ScaleBalanced,
        oxygenSaturation: HeartPulse,
    };

    return (
        <section className="w-full mx-auto bg-white p-6 shadow-md rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full border-b-2 border-gray-200 pb-6 mb-4 ">
                <button
                    className="border border-gray-300 text-white bg-green-500 py-2 px-4 rounded hover:bg-green-600 flex items-center justify-center gap-2 w-full"
                    onClick={() => navigate(`/pets/pet/${id}/new-record`)}
                >
                    <PlusIcon className="w-5 h-5" />
                    NUEVO REGISTRO
                </button>
                <button
                    className="border border-gray-300 text-black bg-gray-50 py-2 px-4 rounded hover:bg-gray-100 flex items-center justify-center gap-2 w-full"
                    onClick={() => navigate(`/pets/pet/${id}/create-note`)}
                >
                    <FileContract className="w-5 h-5" />
                    NOTA
                </button>
            </div>

            {records && records.length > 0 ? (
                records.map((record, index) => (
                    <div
                        key={index}
                        className="mb-6 border-b-2 border-gray-200"
                    >
                        {record.type === 'note' ? (
                            <div className="p-2 ">
                                <div className="flex mb-2 gap-2">
                                    <FileContratIcon className="w-7 h-7 text-gray-500" />
                                    <h2 className="text-2xl font-medium text-gray-500 pb-4 flex flex-col">
                                        Nota
                                        <span className="text-sm text-gray-500">{record?.dateTime}</span>
                                    </h2>
                                </div>
                                <p className="text-gray-700 pb-2">{record.content}</p>
                            </div>
                        ) : (
                            <div key={index} className="mb-8">
                                <div className="flex mb-2 gap-2">
                                    <Stethoscope className="w-7 h-7 text-red-500" />
                                    <h2 className="text-2xl font-medium text-red-500 pb-4 flex flex-col">
                                        Revisión
                                        <span className="text-sm text-gray-500">{record?.dateTime}</span>
                                    </h2>
                                </div>

                                <div className="mb-4">
                                    <h3 className="font-semibold text-gray-600">Motivo de consulta:</h3>
                                    <p className="text-gray-700">{record?.reason}</p>
                                </div>

                                <div className="mb-4">
                                    <h3 className="font-semibold text-gray-600">Anamnesis:</h3>
                                    <p className="text-gray-700">{record?.anamnesis}</p>
                                </div>

                                <div className="mb-4">
                                    <h3 className="font-semibold text-gray-600 mb-1">Constantes fisiológicas:</h3>
                                    <div className="flex gap-4">
                                        {Object.entries(record?.physiologicalConstants || {}).map(([key, value], i) => {
                                            const IconComponent = physiologicalIcons[key];
                                            return (
                                                <div key={i} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                                                    <div className="bg-gray-300 text-gray-500 rounded-full h-8 w-8 flex items-center justify-center">
                                                        {IconComponent && <IconComponent className="w-5 h-5" />}
                                                    </div>
                                                    <div className="text-gray-700 font-medium">{key}:</div>
                                                    <div className="text-gray-700 font-medium">{value}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h3 className="font-semibold text-gray-600">Examen clínico:</h3>
                                    <p className="text-gray-700">{record?.clinicalExam}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No hay registros clínicos disponibles para esta mascota.</p>
            )}
        </section>
    );
}

export { ClinicalRecords };
