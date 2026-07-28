import { useState, ChangeEvent, useMemo, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { MedicalQueueItem } from '@t/clinical.types';
import { EditQueuePatientModal } from '@components/modals/EditQueuePatientModal';
import { ConfirmActionModal } from '@components/modals/ConfirmActionModal';
import { useTableControls } from '@hooks/useTableControls';
import { Avatar } from '@components/ui/Avatar';
import { Pagination } from '@components/ui/Pagination';
import { EmptyState } from '@components/ui/EmptyState';
import { RowActionMenu } from '@components/ui/RowActionMenu';
import { StatsCard } from '@components/ui/StatsCard';
import BookIcon from '@assets/bookIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import PenIcon from '@assets/penIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import EyeIcon from '@assets/eyeIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';
import Stethoscope from '@assets/stethoscope.svg?react';
import EraserIcon from '@assets/eraserIcon.svg?react';

const DOCTOR_OPTIONS = [
  'olga-bustinza',
  'luis-alvarado',
  'juan-perez',
];

const STATE_OPTIONS = [
  'En espera',
  'En atenci\u00f3n',
  'Atendido',
  'Suspendido',
];

function getStateBadge(state: string): string {
  if (state === 'En espera') return 'bg-danger/10 text-danger';
  if (state.includes('atenci') || state.includes('Atenci')) return 'bg-amber/10 text-amber';
  if (state === 'Atendido' || state === 'Terminado') return 'bg-success/10 text-success';
  if (state === 'Suspendido') return 'bg-slate-100 text-slate';
  return 'bg-slate-100 text-slate';
}

function ClinicQueue() {
  const { petsInQueueMedical } = useClients();
  const navigate = useNavigate();

  const [isEditQueueModalOpen, setIsEditQueueModalOpen] = useState(false);
  const [isConfirmActionModalOpen, setIsConfirmActionModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<MedicalQueueItem | null>(null);
  const [queueDataToEdit, setQueueDataToEdit] = useState<MedicalQueueItem | null>(null);

  const [doctorFilter, setDoctorFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  const preFiltered = useMemo(() => {
    return petsInQueueMedical.filter((item) => {
      const matchesDoctor = doctorFilter
        ? item.assignedDoctor.toLowerCase().includes(doctorFilter.toLowerCase())
        : true;
      const matchesState = stateFilter
        ? (item.state as string) === stateFilter
        : true;
      return matchesDoctor && matchesState;
    });
  }, [petsInQueueMedical, doctorFilter, stateFilter]);

  const controls = useTableControls(preFiltered, {
    itemsPerPage: 10,
    searchFields: ['petData.petName', 'petData.ownerName', 'assignedDoctor'],
    dateField: 'dateOfAttention',
  });

  const stats = useMemo(() => {
    const total = petsInQueueMedical.length;
    const waiting = petsInQueueMedical.filter((p) => p.state === 'En espera').length;
    const inAttention = petsInQueueMedical.filter((p) => (p.state as string).includes('atenci')).length;
    const attended = petsInQueueMedical.filter((p) => p.state === 'Terminado' || (p.state as string) === 'Atendido').length;
    return { total, waiting, inAttention, attended };
  }, [petsInQueueMedical]);

  const hasActiveFilters =
    controls.searchText.trim() !== '' ||
    controls.dateFrom !== '' ||
    controls.dateTo !== '' ||
    doctorFilter !== '' ||
    stateFilter !== '';

  function resetFilters() {
    controls.setSearchText('');
    controls.setDateFrom('');
    controls.setDateTo('');
    setDoctorFilter('');
    setStateFilter('');
  }

  function openEditModal(item: MedicalQueueItem) {
    setQueueDataToEdit(item);
    setIsEditQueueModalOpen(true);
  }

  function openDeleteModal(item: MedicalQueueItem) {
    setPatientToDelete(item);
    setIsConfirmActionModalOpen(true);
  }

  return (
    <section className="w-full">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
            Atenci&oacute;n cl&iacute;nica
          </span>
          <h1 className="text-2xl font-bold font-display text-ink">Sala de Espera</h1>
        </div>
        <button
          onClick={() => navigate('/sales/client/no_client')}
          className="bg-primary text-white py-2.5 px-5 rounded-xl hover:opacity-90 flex items-center gap-2 transition-colors font-semibold font-display shadow-sm shadow-primary/25 whitespace-nowrap"
        >
          <PlusIcon className="w-5 h-5" />
          Agregar paciente
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatsCard icon={BookIcon} value={stats.total} label="Total en cola" color="#3B82F6" />
        <StatsCard icon={Stethoscope} value={stats.inAttention} label="En atenci&oacute;n" color="#D97706" />
        <StatsCard icon={Stethoscope} value={stats.waiting} label="En espera" color="#DC2626" />
        <StatsCard icon={Stethoscope} value={stats.attended} label="Atendidos" color="#059669" />
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
                placeholder="Buscar por paciente o due&ntilde;o..."
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
            <select value={doctorFilter} onChange={(e) => setDoctorFilter(e.target.value)} className="w-full sm:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30">
              <option value="">M&eacute;dico</option>
              {DOCTOR_OPTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="w-full sm:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30">
              <option value="">Estado</option>
              {STATE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
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
            <EmptyState icon={SearchIcon} title="Sin resultados" description="No encontramos pacientes que coincidan con tu b&uacute;squeda." actionLabel="Limpiar filtros" onAction={resetFilters} />
          ) : (
            <EmptyState icon={BookIcon} title="Sala de espera vac&iacute;a" description="Agrega un paciente a la cola de atenci&oacute;n." actionLabel="Agregar paciente" onAction={() => navigate('/sales/client/no_client')} />
          )
        ) : (
          <Fragment>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate w-12">N&deg;</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Fecha</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Mascota</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Due&ntilde;o</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">M&eacute;dico</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Estado</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Alerta</th>
                    <th className="py-3 pr-4 pl-2 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {controls.paginatedData.map((item: MedicalQueueItem, idx: number) => {
                    const rowIndex = (controls.currentPage - 1) * controls.itemsPerPage + idx + 1;
                    return (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 text-sm font-display font-semibold text-ink text-center">{rowIndex}</td>
                        <td className="py-3 px-3 text-sm text-slate whitespace-nowrap">
                          {item.dateOfAttention} {item.timeOfAttention}
                        </td>
                        <td className="py-3 px-3">
                          <Link to={`/pets/pet/${item.petData?.id}/update`} className="flex items-center gap-3 hover:opacity-80 transition-opacity" onClick={(e) => e.stopPropagation()}>
                            <Avatar name={item.petData?.petName || ''} size="sm" />
                            <div className="min-w-0">
                              <div className="text-sm text-ink font-medium truncate">{item.petData?.petName}</div>
                              <div className="text-xs text-slate">{item.petData?.species} &middot; {item.petData?.breed}</div>
                            </div>
                          </Link>
                        </td>
                        <td className="py-3 px-3">
                          <Link to={`/clients/client/${item.petData?.ownerId}/update`} className="flex items-center gap-2 hover:opacity-80 transition-opacity" onClick={(e) => e.stopPropagation()}>
                            <Avatar name={item.ownerName} size="sm" />
                            <span className="text-sm text-slate">{item.ownerName}</span>
                          </Link>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <Avatar name={item.assignedDoctor} size="sm" />
                            <span className="text-sm text-slate">{item.assignedDoctor}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button onClick={() => openEditModal(item)} className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-opacity hover:opacity-80 ${getStateBadge(item.state)}`}>
                            {item.state}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {item.notes ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning" title={item.notes}>
                              <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                              Alerta
                            </span>
                          ) : (
                            <span className="text-slate/30 text-xs">—</span>
                          )}
                        </td>
                        <td className="py-3 pr-4 pl-2">
                          <RowActionMenu
                            items={[
                              { label: 'Editar atenci\u00f3n', icon: PenIcon, onClick: () => openEditModal(item) },
                              { label: 'Ver mascota', icon: EyeIcon, onClick: () => navigate(`/pets/pet/${item.petData?.id}/update`) },
                              { label: 'Ver due\u00f1o', icon: EyeIcon, onClick: () => navigate(`/clients/client/${item.petData?.ownerId}/update`) },
                              { divider: true },
                              { label: 'Eliminar', icon: TrashIcon, danger: true, onClick: () => openDeleteModal(item) },
                            ]}
                          />
                        </td>
                      </tr>
                    );
                  })}
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

      {isEditQueueModalOpen && queueDataToEdit && (
        <EditQueuePatientModal queueData={queueDataToEdit} onClose={() => setIsEditQueueModalOpen(false)} />
      )}

      {isConfirmActionModalOpen && patientToDelete && (
        <ConfirmActionModal
          elementData={patientToDelete}
          onClose={() => setIsConfirmActionModalOpen(false)}
          typeOfOperation="medical"
        />
      )}
    </section>
  );
}

export { ClinicQueue };
