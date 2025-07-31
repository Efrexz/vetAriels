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

    const individualPetData: Pet | undefined = petsData.find(pet => pet.hc === id);

    const petAge = calculateAge(individualPetData?.birthDate);

    // Si no se encuentra la mascota, mostrar un mensaje de error
    if (!individualPetData) {
        return (
            <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
                <div className="bg-white rounded-xl shadow-lg p-12 max-w-xl w-full text-center border-t-4 border-blue-500">
                    <AlertIcon className="text-blue-500 w-16  mx-auto mb-6 opacity-80" />
                    <h1 className="text-4xl font-extrabold text-gray-700 mb-4">
                        Mascota no Registrada
                    </h1>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                        No hemos encontrado ninguna mascota asociada al ID "<strong className="text-blue-600">#{id}</strong>" en nuestros registros. Por favor, verifica el identificador.
                    </p>
                    {/*Separador*/}
                    <div className="border-t border-gray-200 pt-6 mt-6">
                        <Link
                            to="/pets"
                            className="inline-flex items-center px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out text-lg"
                        >
                            <SearchIcon className="w-10 mr-3 text-xl" /> Ver listado de pacientes
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="container mx-auto p-6">
            <div className="flex flex-col lg:flex-row gap-2 justify-between items-center mb-6 border-b-2 border-gray-100 pb-5">
                <h1 className="text-2xl font-semibold text-gray-600">
                    Informacion de la Mascota
                </h1>
                <HorizontalMenu mode="pets" />
            </div>

            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-t-lg overflow-hidden">
                <div className="w-full md:w-1/4 p-6 bg-gray-100 flex flex-col items-center">
                    <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                        <RoleUserIcon className="w-16 h-16 text-gray-500" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800">{individualPetData?.petName}</h2>
                    <div className="text-center mt-4 space-y-2">
                        <p className="text-gray-600">
                            <strong>N° Historia Clínica: </strong>{individualPetData?.hc}
                        </p>
                        <p className="text-gray-600">
                            <strong>Especie: </strong>{individualPetData?.species}
                        </p>
                        <p className="text-gray-600">
                            <strong>Raza: </strong>{individualPetData?.breed}
                        </p>
                        <p className="text-gray-600">
                            <strong>Sexo: </strong>{individualPetData?.sex}
                        </p>
                        <p className="text-gray-600">
                            <strong>¿Esterilizado?: </strong>{individualPetData?.esterilized ? 'SÍ' : 'NO'}
                        </p>
                        <p className="text-gray-600">
                            <strong>Fecha de Nacimiento: </strong>{individualPetData?.birthDate}
                        </p>
                        <div className="text-gray-600">
                            <strong>Edad: </strong>
                            {petAge.years} {petAge.years === 1 ? "año" : "años"}, {petAge.months} {petAge.months === 1 ? "mes" : "meses"} y {petAge.days} {petAge.days === 1 ? "día" : "días"}
                        </div>
                        <p className="text-gray-600">
                            <strong>Propietario: </strong>
                            <Link to={`/clients/client/${individualPetData?.ownerId}/update `} className="text-blue-500 underline">
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