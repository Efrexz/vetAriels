import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { Pet } from '@t/client.types';
import { useTableControls } from '@hooks/useTableControls';
import { Avatar } from '@components/ui/Avatar';
import { Pagination } from '@components/ui/Pagination';
import { EmptyState } from '@components/ui/EmptyState';
import { RowActionMenu } from '@components/ui/RowActionMenu';
import { StatsCard } from '@components/ui/StatsCard';
import PlusIcon from '@assets/plusIcon.svg?react';
import EyeIcon from '@assets/eyeIcon.svg?react';
import PawIcon from '@assets/pawIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';
import EraserIcon from '@assets/eraserIcon.svg?react';

function ClientPets() {
  const navigate = useNavigate();
  const { petsData } = useClients();
  const { id } = useParams<{ id: string }>();
  const petsByOwner: Pet[] = petsData.filter((pet) => pet.ownerId === id);

  const controls = useTableControls(petsByOwner, {
    itemsPerPage: 10,
    searchFields: ['petName', 'hc', 'breed'],
    dateField: 'registrationDate',
  });

  const stats = useMemo(() => {
    const caninos = petsByOwner.filter((p) => p.species === 'CANINO').length;
    const felinos = petsByOwner.filter((p) => p.species === 'FELINO').length;
    const active = petsByOwner.filter((p) => p.active).length;
    return { total: petsByOwner.length, caninos, felinos, active };
  }, [petsByOwner]);

  const hasActiveFilters =
    controls.searchText.trim() !== '' ||
    controls.dateFrom !== '' ||
    controls.dateTo !== '';

  function resetFilters() {
    controls.setSearchText('');
    controls.setDateFrom('');
    controls.setDateTo('');
  }

  if (petsByOwner.length === 0 && !(id && !id.match(/no_client/i))) {
    return (
      <div className="flex flex-col w-full">
        <div className="p-2 lg:px-6">
          <div className="bg-paper rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-row justify-center sm:justify-start items-center gap-3 p-5">
              <button
                onClick={() => navigate(`/pets/create/${id}`)}
                className="bg-primary text-white py-2 px-5 rounded-xl hover:opacity-90 flex items-center gap-2 transition-colors font-semibold font-display shadow-sm shadow-primary/25"
              >
                <PlusIcon className="w-5 h-5" />
                Nueva mascota
              </button>
            </div>
            <EmptyState
              icon={PawIcon}
              title="Sin mascotas registradas"
              description="Este cliente a&uacute;n no tiene mascotas registradas."
              actionLabel="Nueva mascota"
              onAction={() => navigate(`/pets/create/${id}`)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="p-2 lg:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatsCard icon={PawIcon} value={stats.total} label="Total mascotas" color="#3B82F6" />
          <StatsCard icon={PawIcon} value={stats.caninos} label="Caninos" color="#D97706" />
          <StatsCard icon={PawIcon} value={stats.felinos} label="Felinos" color="#0D9488" />
          <StatsCard icon={PawIcon} value={stats.active} label="Activas" color="#059669" />
        </div>

        <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex items-center w-full lg:w-[280px] border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-shadow">
                <div className="flex items-center justify-center bg-white pl-3">
                  <SearchIcon className="w-4 h-4 text-slate" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
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

              <button
                onClick={() => navigate(`/pets/create/${id}`)}
                className="ml-auto bg-primary text-white py-2 px-5 rounded-xl hover:opacity-90 flex items-center gap-2 transition-colors font-semibold font-display shadow-sm shadow-primary/25 whitespace-nowrap"
              >
                <PlusIcon className="w-5 h-5" />
                Nueva mascota
              </button>
            </div>
          </div>

          {controls.totalFiltered === 0 ? (
            hasActiveFilters ? (
              <EmptyState icon={SearchIcon} title="Sin resultados" description="No encontramos mascotas que coincidan con tu b&uacute;squeda." actionLabel="Limpiar filtros" onAction={resetFilters} />
            ) : (
              <EmptyState icon={PawIcon} title="Sin mascotas registradas" description="Este cliente a&uacute;n no tiene mascotas registradas." actionLabel="Nueva mascota" onAction={() => navigate(`/pets/create/${id}`)} />
            )
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate">Mascota</th>
                      <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">#HC</th>
                      <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Especie &middot; Raza</th>
                      <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Sexo</th>
                      <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Nacimiento</th>
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
                              <div className="text-xs text-slate">{pet.registrationDate}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-sm text-ink font-display font-semibold">{pet.hc}</td>
                        <td className="py-3 px-3 text-sm text-slate">
                          <span className={pet.species === 'CANINO' ? 'text-amber' : 'text-teal'}>{pet.species === 'CANINO' ? 'Canino' : 'Felino'}</span>
                          {' '}&middot;{' '}
                          <span>{pet.breed}</span>
                        </td>
                        <td className="py-3 px-3 text-center text-sm text-slate">{pet.sex === 'MACHO' ? 'Macho' : 'Hembra'}</td>
                        <td className="py-3 px-3 text-sm text-slate whitespace-nowrap">{pet.birthDate || '—'}</td>
                        <td className="py-3 pr-4 pl-2">
                          <RowActionMenu
                            items={[
                              { label: 'Ver mascota', icon: EyeIcon, onClick: () => navigate(`/pets/pet/${pet.id}/update`) },
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
            </>
          )}

          {hasActiveFilters && (
            <div className="flex justify-end px-4 pb-4">
              <button onClick={resetFilters} className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
                <EraserIcon className="w-4 h-4" />
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { ClientPets };
