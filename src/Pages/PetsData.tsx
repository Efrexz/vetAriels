import { useState, useMemo, ChangeEvent, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { Pet } from '@t/client.types';
import { DeleteModal } from '@components/modals/DeleteModal';
import { useTableControls } from '@hooks/useTableControls';
import { Avatar } from '@components/ui/Avatar';
import { Pagination } from '@components/ui/Pagination';
import { EmptyState } from '@components/ui/EmptyState';
import { RowActionMenu } from '@components/ui/RowActionMenu';
import { StatsCard } from '@components/ui/StatsCard';
import PlusIcon from '@assets/plusIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';
import EyeIcon from '@assets/eyeIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import Stethoscope from '@assets/stethoscope.svg?react';
import PawIcon from '@assets/pawIcon.svg?react';
import InclinedPaw from '@assets/inclinedPaw.svg?react';
import CalendarIcon from '@assets/calendarIcon.svg?react';
import EraserIcon from '@assets/eraserIcon.svg?react';

const MONTHS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

function parseDate(dateStr: string): Date | null {
  let d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;
  const parts = dateStr.split(new RegExp('[-/]'));
  if (parts.length === 3) {
    d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

function formatDateShort(dateStr: string): string {
  const d = parseDate(dateStr);
  if (d) return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  return dateStr;
}

function PetsData() {
  const { petsData } = useClients();
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<Pet | null>(null);

  const [speciesFilter, setSpeciesFilter] = useState('');
  const [sexFilter, setSexFilter] = useState('');

  const preFiltered = useMemo(() => {
    return petsData.filter((pet) => {
      const matchesSpecies = speciesFilter
        ? pet.species === speciesFilter
        : true;
      const matchesSex = sexFilter ? pet.sex === sexFilter : true;
      return matchesSpecies && matchesSex;
    });
  }, [petsData, speciesFilter, sexFilter]);

  const controls = useTableControls(preFiltered, {
    itemsPerPage: 10,
    searchFields: ['petName', 'hc', 'breed', 'ownerName'],
    dateField: 'registrationDate',
  });

  const stats = useMemo(() => {
    const total = petsData.length;
    const caninos = petsData.filter((p) => p.species === 'CANINO').length;
    const felinos = petsData.filter((p) => p.species === 'FELINO').length;
    const now = new Date();
    const newThisMonth = petsData.filter((p) => {
      const d = parseDate(p.registrationDate);
      return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    return { total, caninos, felinos, newThisMonth };
  }, [petsData]);

  const hasActiveFilters =
    controls.searchText.trim() !== '' ||
    controls.dateFrom !== '' ||
    controls.dateTo !== '' ||
    speciesFilter !== '' ||
    sexFilter !== '';

  function resetFilters() {
    controls.setSearchText('');
    controls.setDateFrom('');
    controls.setDateTo('');
    setSpeciesFilter('');
    setSexFilter('');
  }

  return (
    <section className="w-full">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
            Gesti&oacute;n de mascotas
          </span>
          <h1 className="text-2xl font-bold font-display text-ink">Mascotas</h1>
        </div>
        <button
          onClick={() => navigate('/pets/create/no_client')}
          className="bg-primary text-white py-2.5 px-5 rounded-xl hover:opacity-90 flex items-center gap-2 transition-colors font-semibold font-display shadow-sm shadow-primary/25 whitespace-nowrap"
        >
          <PlusIcon className="w-5 h-5" />
          Nueva mascota
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatsCard icon={PawIcon} value={stats.total} label="Total mascotas" color="#3B82F6" />
        <StatsCard icon={InclinedPaw} value={stats.caninos} label="Caninos" color="#D97706" />
        <StatsCard icon={InclinedPaw} value={stats.felinos} label="Felinos" color="#0D9488" />
        <StatsCard icon={CalendarIcon} value={stats.newThisMonth} label="Nuevas este mes" color="#059669" />
      </div>

      <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row gap-3 mb-3">
            <div className="flex items-center w-full lg:w-[320px] border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-shadow">
              <div className="flex items-center justify-center bg-white pl-3">
                <SearchIcon className="w-4 h-4 text-slate" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre, HC o due&ntilde;o..."
                value={controls.searchText}
                onChange={(e) => controls.setSearchText(e.target.value)}
                className="w-full py-2 pl-2 pr-3 focus:outline-none focus:ring-0 bg-white text-sm text-ink placeholder:text-slate/70"
              />
              {controls.searchText && (
                <button onClick={() => controls.setSearchText('')} className="pr-3 text-slate/40 hover:text-slate transition-colors">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
            <input type="date" value={controls.dateFrom} onChange={(e) => controls.setDateFrom(e.target.value)} className="w-full lg:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" title="Fecha desde" />
            <input type="date" value={controls.dateTo} onChange={(e) => controls.setDateTo(e.target.value)} className="w-full lg:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30" title="Fecha hasta" />
          </div>

          <div className="flex flex-wrap gap-3">
            <select value={speciesFilter} onChange={(e) => setSpeciesFilter(e.target.value)} className="w-full sm:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30">
              <option value="">Especie</option>
              <option value="CANINO">Canino</option>
              <option value="FELINO">Felino</option>
            </select>
            <select value={sexFilter} onChange={(e) => setSexFilter(e.target.value)} className="w-full sm:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30">
              <option value="">Sexo</option>
              <option value="MACHO">Macho</option>
              <option value="HEMBRA">Hembra</option>
            </select>

            {hasActiveFilters && (
              <button onClick={resetFilters} className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline whitespace-nowrap">
                <EraserIcon className="w-4 h-4" />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {controls.totalFiltered === 0 ? (
          hasActiveFilters ? (
            <EmptyState icon={SearchIcon} title="Sin resultados" description="No encontramos mascotas que coincidan con tu b&uacute;squeda." actionLabel="Limpiar filtros" onAction={resetFilters} />
          ) : (
            <EmptyState icon={PawIcon} title="No hay mascotas registradas" description="Registra la primera mascota en el sistema." actionLabel="Nueva mascota" onAction={() => navigate('/pets/create/no_client')} />
          )
        ) : (
          <Fragment>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate">Mascota</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">#HC</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Especie</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Raza</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Sexo</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Nacimiento</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Due&ntilde;o</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Estado</th>
                    <th className="py-3 pr-4 pl-2 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {controls.paginatedData.map((pet: Pet) => (
                    <tr key={pet.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={pet.petName} size="sm" />
                          <div className="min-w-0">
                            <div className="text-sm text-ink font-medium truncate">{pet.petName}</div>
                            <div className="text-xs text-slate">{formatDateShort(pet.registrationDate)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-sm text-ink font-display font-semibold">{pet.hc}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pet.species === 'CANINO' ? 'bg-amber/10 text-amber' : 'bg-teal/10 text-teal'}`}>
                          {pet.species === 'CANINO' ? 'Canino' : 'Felino'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-sm text-slate truncate max-w-[140px]" title={pet.breed}>{pet.breed}</td>
                      <td className="py-3 px-3 text-center text-sm text-slate">{pet.sex === 'MACHO' ? 'Macho' : 'Hembra'}</td>
                      <td className="py-3 px-3 text-sm text-slate whitespace-nowrap">{pet.birthDate || '—'}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={pet.ownerName} size="sm" />
                          <span className="text-sm text-slate truncate max-w-[120px]" title={pet.ownerName}>{pet.ownerName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${pet.active ? 'text-success' : 'text-danger'}`}>
                          <span className={`inline-block w-2 h-2 rounded-full ${pet.active ? 'bg-success' : 'bg-danger'}`} />
                          {pet.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-3 pr-4 pl-2">
                        <RowActionMenu
                          items={[
                            { label: 'Ver mascota', icon: EyeIcon, onClick: () => navigate(`/pets/pet/${pet.id}/update`) },
                            { label: 'Historial cl&iacute;nico', icon: Stethoscope, onClick: () => navigate(`/pets/pet/${pet.id}/clinical-records`) },
                            { divider: true },
                            { label: 'Eliminar', icon: TrashIcon, danger: true, onClick: () => setDeleteTarget(pet) },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 pb-4">
              <Pagination
                currentPage={controls.currentPage}
                totalPages={controls.totalPages}
                onPageChange={controls.setCurrentPage}
                itemsPerPage={controls.itemsPerPage}
                onItemsPerPageChange={controls.setItemsPerPage}
                showingFrom={controls.showingFrom}
                showingTo={controls.showingTo}
                totalItems={controls.totalFiltered}
              />
            </div>
          </Fragment>
        )}
      </div>

      {deleteTarget && (
        <DeleteModal elementToDelete={deleteTarget} onClose={() => setDeleteTarget(null)} mode="pets" />
      )}
    </section>
  );
}

export { PetsData };
