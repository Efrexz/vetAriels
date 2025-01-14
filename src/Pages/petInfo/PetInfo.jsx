import { useContext } from 'react';
import { Link, useParams } from "react-router-dom";
import { ClientsContext } from '@context/ClientsContext';
import { HorizontalMenu } from '@components/HorizontalMenu';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import { PetProfile } from './PetProfile';
import { ClinicalRecords } from './ClinicalRecords';

function PetInfo() {

    const { petsData } = useContext(ClientsContext);
    const { id, section } = useParams();

    const individualPetData = petsData.find(pet => pet.hc === id);

    function calculateAge(birthDate) {
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
    const petAge = calculateAge(individualPetData?.birthDate);

    return (
        <main className="container mx-auto p-6">
            <div className="flex flex-col lg:flex-row gap-2 justify-between items-center mb-6 border-b-2 border-gray-100 pb-5">
                <h1 className="text-2xl font-semibold text-gray-800">Informacion de la Mascota
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
                            <strong>¿Esterilizado?: </strong>{individualPetData?.isSterilized ? 'SÍ' : 'NO'}
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
                            <Link to={`/clients/client/${individualPetData.ownerId}/update`} className="text-blue-500 underline">
                                {individualPetData?.ownerName}
                            </Link>
                        </p>
                    </div>
                </div>
                {section === 'update' && <PetProfile petData={individualPetData} />}
                {section === 'clinical-records' && <ClinicalRecords />}
            </div>
        </main>
    );
}

export { PetInfo };