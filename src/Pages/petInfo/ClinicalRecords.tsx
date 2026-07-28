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
        <section className="w-full mx-auto bg-paper p-6 rounded-2xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full border-b border-slate-100 pb-6 mb-2 ">
                <button
                    className="border border-slate-200 text-white bg-primary py-1.5 px-4 rounded-xl hover:opacity-90 font-semibold font-display shadow-sm shadow-primary/25 flex items-center justify-center gap-2 w-full transition-colors"
                    onClick={() => navigate(`/pets/pet/${id}/new-record`)}
                >
                    <PlusIcon className="w-4 h-4" />
                    Nuevo registro
                </button>
                <button
                    className="border border-slate-300 text-ink bg-white py-1.5 px-4 rounded-xl hover:bg-slate-100 flex items-center justify-center gap-2 w-full transition-colors"
                    onClick={() => navigate(`/pets/pet/${id}/create-note`)}
                >
                    <FileContract className="w-4 h-4 text-slate" />
                    Nota
                </button>
            </div>

            {records?.length > 0 ? (
                records.map((record, index) => (
                    <div
                        key={record.id}
                        className="mb-2 border-b border-slate-100 pb-2"
                    >
                        {record.type === 'note' ? (
                            <div className="p-2">
                                <div className="flex justify-between items-center mb-2 gap-2">
                                    <div className="flex gap-2 items-center">
                                        <FileContract className="w-7 h-7 text-slate" />
                                        <h2 className="text-xl font-medium text-ink pb-4 flex flex-col">
                                            Nota
                                            <span className="text-xs text-slate">{record?.dateTime}</span>
                                        </h2>
                                    </div>
                                    <div className="flex">
                                        <button
                                            className="text-primary hover:opacity-90 p-2 rounded transition-colors"
                                            title='Editar Nota'
                                            onClick={() => {
                                                navigate(`/pets/pet/${id}/edit-note/${record.id}`)
                                            }}
                                        >
                                            <PenIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="text-success hover:text-success/80 p-2 rounded transition-colors"
                                            title={`${record.createdBy}`}
                                        >
                                            <RoleUserIcon
                                                className="w-4 h-4 "
                                            />
                                        </button>
                                        <button
                                            className="text-danger hover:text-danger/80 p-2 rounded transition-colors"
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
                                <p className="text-slate pb-2">{record.content}</p>
                            </div>
                        ) : (
                            <div key={index} className="mb-2">
                                <div className="flex justify-between items-center mb-1 gap-2">
                                    <div className="flex gap-2 items-center">
                                        <Stethoscope className="w-7 h-7 text-primary" />
                                        <h2 className="text-xl font-medium text-primary pb-2 flex flex-col">
                                            Revisión
                                            <span className="text-xs text-slate">{record?.dateTime}</span>
                                        </h2>
                                    </div>
                                    <div className="flex">
                                        <button
                                            className="text-primary hover:opacity-90 p-2 rounded transition-colors"
                                            title='Editar Registro'
                                            onClick={() => {
                                                navigate(`/pets/pet/${id}/edit-record/${record.id}`)
                                            }}
                                        >
                                            <PenIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="text-success hover:text-success/80 p-2 rounded transition-colors"
                                            title={`${record.createdBy}`}
                                        >
                                            <RoleUserIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="text-danger hover:text-danger/80 p-2 rounded transition-colors"
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
                                    <h3 className="font-semibold text-ink">Motivo de consulta:</h3>
                                    <p className="text-slate">{record?.reason}</p>
                                </div>

                                <div className="mb-2">
                                    <h3 className="font-semibold text-ink">Anamnesis:</h3>
                                    <p className="text-slate">{record?.anamnesis}</p>
                                </div>

                                <div className="mb-2">
                                    <h3 className="font-semibold text-ink mb-1">Constantes fisiológicas:</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {Object.entries(record?.physiologicalConstants || {}).map(([key, value], i) => {
                                            const IconComponent = physiologicalIcons[key];
                                            return (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-slate-300"
                                                >
                                                    <div className="bg-slate-200 text-slate rounded-full h-6 w-6 flex items-center justify-center">
                                                        {IconComponent && <IconComponent className="w-5 h-5" />}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <span className="text-ink font-medium">{key}:</span>
                                                        <span className="text-slate font-medium">{value}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h3 className="font-semibold text-ink">Examen clínico:</h3>
                                    <p className="text-slate">{record?.clinicalExam}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-slate text-center">No hay registros clínicos disponibles para esta mascota.</p>
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
