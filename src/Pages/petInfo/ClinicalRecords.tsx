import { useState, ComponentType, } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { ConfirmActionModal } from '@components/modals/ConfirmActionModal';
import { PetRecord } from '@t/client.types';
import { NotFound } from '@components/ui/NotFound';
import ScaleBalanced from '@assets/scaleBalanced.svg?react';
import HeartPulse from '@assets/heartPulse.svg?react';
import Temperature from '@assets/temperature.svg?react';
import PenIcon from '@assets/penIcon.svg?react';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import Stethoscope from '@assets/stethoscope.svg?react';
import FileContract from '@assets/fileContract.svg?react';

type Icons = Record<string, ComponentType<React.SVGProps<SVGSVGElement>>>;

const physiologicalIcons: Icons = {
    temperature: Temperature,
    heartRate: HeartPulse,
    weight: ScaleBalanced,
    oxygenSaturation: HeartPulse,
};

function ClinicalRecords() {
    const { petsData } = useClients();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const individualPetData = petsData.find(pet => pet.id === id);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [elementToDelete, setElementToDelete] = useState<PetRecord | null>(null);

    if (!individualPetData) {
        return <NotFound entityName="Mascota" searchId={id!} returnPath="/pets" />;
    }

    const records: PetRecord[] = individualPetData.records || [];

    return (
        <section className="w-full mx-auto bg-gray-800 p-6 shadow-lg rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full border-b-2 border-gray-700 pb-6 mb-2 ">
                <button
                    className="border border-gray-700 text-white bg-cyan-600 py-1.5 px-4 rounded-xl hover:bg-cyan-700 flex items-center justify-center gap-2 w-full transition-colors"
                    onClick={() => navigate(`/pets/pet/${id}/new-record`)}
                >
                    <PlusIcon className="w-4 h-4" />
                    NUEVO REGISTRO
                </button>
                <button
                    className="border border-gray-700 text-gray-200 bg-gray-700 py-1.5 px-4 rounded-xl hover:bg-gray-600 flex items-center justify-center gap-2 w-full transition-colors"
                    onClick={() => navigate(`/pets/pet/${id}/create-note`)}
                >
                    <FileContract className="w-4 h-4 text-gray-400" />
                    NOTA
                </button>
            </div>

            {records?.length > 0 ? (
                records.map((record, index) => (
                    <div
                        key={record.id}
                        className="mb-2 border-b border-gray-700 pb-2"
                    >
                        {record.type === 'note' ? (
                            <div className="p-2">
                                <div className="flex justify-between items-center mb-2 gap-2">
                                    <div className="flex gap-2 items-center">
                                        <FileContract className="w-7 h-7 text-gray-400" />
                                        <h2 className="text-xl font-medium text-gray-300 pb-4 flex flex-col">
                                            Nota
                                            <span className="text-xs text-gray-400">{record?.dateTime}</span>
                                        </h2>
                                    </div>
                                    <div className="flex">
                                        <button
                                            className="text-cyan-500 hover:text-cyan-400 p-2 rounded transition-colors"
                                            title='Editar Nota'
                                            onClick={() => {
                                                navigate(`/pets/pet/${id}/edit-note/${record.id}`)
                                            }}
                                        >
                                            <PenIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="text-emerald-500 hover:text-emerald-600 p-2 rounded transition-colors"
                                            title={`${record.createdBy}`}
                                        >
                                            <RoleUserIcon
                                                className="w-4 h-4 "
                                            />
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-400 p-2 rounded transition-colors"
                                            title='Eliminar Nota'
                                            onClick={() => {
                                                setElementToDelete(record);
                                                setIsModalOpen(true)
                                            }}
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-400 pb-2">{record.content}</p>
                            </div>
                        ) : (
                            <div key={index} className="mb-2">
                                <div className="flex justify-between items-center mb-1 gap-2">
                                    <div className="flex gap-2 items-center">
                                        <Stethoscope className="w-7 h-7 text-cyan-500" />
                                        <h2 className="text-xl font-medium text-cyan-500 pb-2 flex flex-col">
                                            Revisión
                                            <span className="text-xs text-gray-400">{record?.dateTime}</span>
                                        </h2>
                                    </div>
                                    <div className="flex">
                                        <button
                                            className="text-cyan-500 hover:text-cyan-400 p-2 rounded transition-colors"
                                            title='Editar Registro'
                                            onClick={() => {
                                                navigate(`/pets/pet/${id}/edit-record/${record.id}`)
                                            }}
                                        >
                                            <PenIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="text-emerald-500 hover:text-emerald-600 p-2 rounded transition-colors"
                                            title={`${record.createdBy}`}
                                        >
                                            <RoleUserIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-400 p-2 rounded transition-colors"
                                            title='Eliminar Registro'
                                            onClick={() => {
                                                setElementToDelete(record);
                                                setIsModalOpen(true)
                                            }}
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <h3 className="font-semibold text-gray-300">Motivo de consulta:</h3>
                                    <p className="text-gray-400">{record?.reason}</p>
                                </div>

                                <div className="mb-2">
                                    <h3 className="font-semibold text-gray-300">Anamnesis:</h3>
                                    <p className="text-gray-400">{record?.anamnesis}</p>
                                </div>

                                <div className="mb-2">
                                    <h3 className="font-semibold text-gray-300 mb-1">Constantes fisiológicas:</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {Object.entries(record?.physiologicalConstants || {}).map(([key, value], i) => {
                                            const IconComponent = physiologicalIcons[key];
                                            return (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-2 bg-gray-700 p-2 rounded-xl shadow-sm border border-gray-600"
                                                >
                                                    <div className="bg-gray-600 text-gray-400 rounded-full h-6 w-6 flex items-center justify-center">
                                                        {IconComponent && <IconComponent className="w-5 h-5" />}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <span className="text-gray-300 font-medium">{key}:</span>
                                                        <span className="text-gray-400 font-medium">{value}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h3 className="font-semibold text-gray-300">Examen clínico:</h3>
                                    <p className="text-gray-400">{record?.clinicalExam}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-gray-400 text-center">No hay registros clínicos disponibles para esta mascota.</p>
            )}

            {
                isModalOpen && elementToDelete && (
                    <ConfirmActionModal
                        elementData={elementToDelete}
                        typeOfOperation="deleteRecordAndNote"
                        onClose={() => setIsModalOpen(false)}
                    />
                )
            }
        </section>
    );
}

export { ClinicalRecords };
