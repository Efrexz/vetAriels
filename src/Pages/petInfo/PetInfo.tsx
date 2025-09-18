import { Link, useParams } from "react-router-dom";
import { useClients } from '@context/ClientsContext';
import { HorizontalMenu } from '@components/ui/HorizontalMenu';
import { PetProfile } from './PetProfile';
import { ClinicalRecords } from './ClinicalRecords';
import { NewRecord } from './NewRecord';
import { AddClinicalNote } from './AddClinicalNote';
import { EditRecord } from './EditRecord';
import { EditClinicalNote } from './EditClinicalNote';
import { Pet } from '@t/client.types';
import { NotFound } from '@components/ui/NotFound';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import AlertIcon from '@assets/alertIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';


function calculateAge(birthDate: string | undefined) {
    if (!birthDate) return { years: 0, months: 0, days: 0 };//Por si acaso no tiene fecha de nacimiento

        const today = new Date();
        const birth = new Date(birthDate);

        let ageYears = today.getFullYear() - birth.getFullYear();
        let ageMonths = today.getMonth() - birth.getMonth();
        let ageDays = today.getDate() - birth.getDate();

        // Ajustar los días y meses si es necesario
        if (ageDays < 0) {
            ageMonths -= 1; // Quitar un mes
            // Obtener los días del mes anterior
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            ageDays += lastMonth.getDate(); // Sumar días del mes anterior
        }

        if (ageMonths < 0) {
            ageYears -= 1; // Quitar un año
            ageMonths += 12; // Ajustar los meses
        }
        return { years: ageYears, months: ageMonths, days: ageDays };
    }

function PetInfo() {

    const { petsData } = useClients();
    const { id, section = 'update' } = useParams<{ id: string; section?: string }>();

    const individualPetData: Pet | undefined = petsData.find(pet => pet.id === id);

    const petAge = calculateAge(individualPetData?.birthDate);

    // Si no se encuentra la mascota, mostrar un mensaje de error
    if (!individualPetData) {
        return (
            <NotFound
                entityName="Mascota"
                searchId={id!}
                returnPath={`/pets`}
            />
        )
    }

    return (
        <main className="p-4 sm:p-6 bg-gray-950 text-gray-200">
            <div className="flex flex-col lg:flex-row gap-2 justify-between items-center mb-6 border-b border-cyan-500 pb-5">
                <h1 className="text-xl sm:text-3xl font-medium text-cyan-500">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">Información de la Mascota</span>
                </h1>
                <HorizontalMenu mode="pets" />
            </div>

            <div className="flex flex-col md:flex-row bg-gray-800 border border-gray-700 shadow-lg rounded-lg overflow-hidden">
                <div className="w-full md:w-1/4 p-6 bg-gray-700 flex flex-col items-center">
                    <div className="w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center mb-4">
                        <RoleUserIcon className="w-16 h-16 text-cyan-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-200">{individualPetData?.petName}</h2>
                    <div className="text-center mt-4 space-y-2">
                        <p className="text-gray-400">
                            <strong>N° Historia Clínica: </strong>{individualPetData?.hc}
                        </p>
                        <p className="text-gray-400">
                            <strong>Especie: </strong>{individualPetData?.species}
                        </p>
                        <p className="text-gray-400">
                            <strong>Raza: </strong>{individualPetData?.breed}
                        </p>
                        <p className="text-gray-400">
                            <strong>Sexo: </strong>{individualPetData?.sex}
                        </p>
                        <p className="text-gray-400">
                            <strong>¿Esterilizado?: </strong>{individualPetData?.esterilized ? 'SÍ' : 'NO'}
                        </p>
                        <p className="text-gray-400">
                            <strong>Fecha de Nacimiento: </strong>{individualPetData?.birthDate}
                        </p>
                        <div className="text-gray-400">
                            <strong>Edad: </strong>
                            {petAge.years} {petAge.years === 1 ? "año" : "años"}, {petAge.months} {petAge.months === 1 ? "mes" : "meses"} y {petAge.days} {petAge.days === 1 ? "día" : "días"}
                        </div>
                        <p className="text-gray-400">
                            <strong>Propietario: </strong>
                            <Link to={`/clients/client/${individualPetData?.ownerId}/update `} className="text-cyan-500 underline">
                                {individualPetData?.ownerName}
                            </Link>
                        </p>
                    </div>
                </div>
                {section === 'update' && <PetProfile petData={individualPetData} />}
                {section === 'clinical-records' && <ClinicalRecords />}
                {section === 'new-record' && <NewRecord />}
                {section === 'edit-record' && <EditRecord />}
                {section === 'create-note' && <AddClinicalNote />}
                {section === 'edit-note' && <EditClinicalNote />}
            </div>
        </main>
    );
}

export { PetInfo };