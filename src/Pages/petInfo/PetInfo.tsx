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

    const { petsData, isLoadingPets } = useClients();
    const { id, section = 'update' } = useParams<{ id: string; section?: string }>();

    const individualPetData: Pet | undefined = petsData.find(pet => pet.id === id);

    const petAge = calculateAge(individualPetData?.birthDate);

    // Mientras carga la lista, no mostrar NotFound: un acceso directo
    // por URL renderizaba "No encontrado" un instante antes de los datos.
    if (isLoadingPets) {
        return <div className="p-6 text-center text-slate">Cargando mascota...</div>;
    }

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
        <main>
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
                    Perfil de la mascota
                </span>
                <div className="flex flex-col lg:flex-row gap-2 justify-between items-start lg:items-center mb-4">
                    <h1 className="text-2xl font-bold font-display text-ink">
                        {individualPetData?.petName}
                    </h1>
                    <HorizontalMenu mode="pets" />
                </div>
            </div>

            <div className="flex flex-col md:flex-row bg-paper border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                <div className="w-full md:w-1/4 p-6 bg-slate-50/50 flex flex-col items-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                        <RoleUserIcon className="w-12 h-12 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold font-display text-ink">{individualPetData?.petName}</h2>
                    <div className="text-center mt-3 space-y-1.5">
                        <p className="text-xs text-slate">
                            <span className="font-semibold text-ink">N° HC: </span>{individualPetData?.hc}
                        </p>
                        <p className="text-xs text-slate">
                            <span className="font-semibold text-ink">Especie: </span>{individualPetData?.species}
                        </p>
                        <p className="text-xs text-slate">
                            <span className="font-semibold text-ink">Raza: </span>{individualPetData?.breed}
                        </p>
                        <p className="text-xs text-slate">
                            <span className="font-semibold text-ink">Sexo: </span>{individualPetData?.sex}
                        </p>
                        <p className="text-xs text-slate">
                            <span className="font-semibold text-ink">&iquest;Esterilizado?: </span>{individualPetData?.esterilized ? 'S&Iacute;' : 'NO'}
                        </p>
                        <p className="text-xs text-slate">
                            <span className="font-semibold text-ink">Nacimiento: </span>{individualPetData?.birthDate}
                        </p>
                        <p className="text-xs text-slate">
                            <span className="font-semibold text-ink">Edad: </span>
                            {petAge.years} {petAge.years === 1 ? "a&ntilde;o" : "a&ntilde;os"}, {petAge.months} {petAge.months === 1 ? "mes" : "meses"} y {petAge.days} {petAge.days === 1 ? "d&iacute;a" : "d&iacute;as"}
                        </p>
                        <p className="text-xs text-slate">
                            <span className="font-semibold text-ink">Propietario: </span>
                            <Link to={`/clients/client/${individualPetData?.ownerId}/update`} className="text-primary underline">
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