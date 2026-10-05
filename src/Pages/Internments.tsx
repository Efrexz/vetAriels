import { useState, useMemo } from 'react';
import { useTableControls } from '@hooks/useTableControls';
import { InfoBanner } from '@components/ui/InfoBanner';
import { Avatar } from '@components/ui/Avatar';
import { Pagination } from '@components/ui/Pagination';
import { EmptyState } from '@components/ui/EmptyState';
import { RowActionMenu } from '@components/ui/RowActionMenu';
import { StatsCard } from '@components/ui/StatsCard';
import HospitalIcon from '@assets/hospitalIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';
import EyeIcon from '@assets/eyeIcon.svg?react';
import PenIcon from '@assets/penIcon.svg?react';
import EraserIcon from '@assets/eraserIcon.svg?react';

interface InternmentEntry {
  id: string;
  date: string;
  patient: string;
  owner: string;
  note: string;
  status: 'Internado' | 'De Alta';
  contact?: string;
}

const userInfo: InternmentEntry[] = [
  {
    id: '1',
    date: '29-07-2024 07:33 PM',
    patient: 'FRAC',
    owner: 'Juan Pérez',
    note: 'Observación post-operatoria',
    status: 'Internado',
  },
  {
    id: '2',
    date: '28-07-2024 10:15 AM',
    patient: 'LUNA',
    owner: 'María García',
    note: 'Recuperación de cirugía',
    status: 'Internado',
  },
  {
    id: '3',
    date: '25-07-2024 02:00 PM',
    patient: 'MAX',
    owner: 'Carlos López',
    note: 'Control rutinario',
    status: 'De Alta',
  },
];

const STATE_OPTIONS = ['Internado', 'De Alta'];

function Internments() {
  const [stateFilter, setStateFilter] = useState('');

  const preFiltered = useMemo(() => {
    return stateFilter
      ? userInfo.filter((i) => i.status === stateFilter)
      : userInfo;
  }, [stateFilter]);

  const controls = useTableControls(preFiltered, {
    itemsPerPage: 10,
    searchFields: ['patient', 'owner', 'note'],
    dateField: 'date',
  });

  const stats = useMemo(() => {
    const total = userInfo.length;
    const interned = userInfo.filter((i) => i.status === 'Internado').length;
    const discharged = userInfo.filter((i) => i.status === 'De Alta').length;
    return { total, interned, discharged };
  }, []);

  const hasActiveFilters =
    controls.searchText.trim() !== '' ||
    controls.dateFrom !== '' ||
    controls.dateTo !== '' ||
    stateFilter !== '';

  function resetFilters() {
    controls.setSearchText('');
    controls.setDateFrom('');
    controls.setDateTo('');
    setStateFilter('');
  }

  return (
    <>
    <div className="mb-4">
      <InfoBanner type="warning">
        El m&oacute;dulo de internamientos es la pr&oacute;xima fase: lo que ves son registros demo y el bot&oacute;n de nuevo internamiento a&uacute;n no est&aacute; activo.
      </InfoBanner>
    </div>
    <section className="w-full">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
            Atenci&oacute;n cl&iacute;nica
          </span>
          <h1 className="text-2xl font-bold font-display text-ink">Internamientos</h1>
        </div>
        <button className="bg-primary text-white py-2.5 px-5 rounded-xl hover:opacity-90 flex items-center gap-2 transition-colors font-semibold font-display shadow-sm shadow-primary/25 whitespace-nowrap">
          <PlusIcon className="w-5 h-5" />
          Nuevo internamiento
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <StatsCard icon={HospitalIcon} value={stats.total} label="Total pacientes" color="#3B82F6" />
        <StatsCard icon={HospitalIcon} value={stats.interned} label="Internados" color="#D97706" />
        <StatsCard icon={HospitalIcon} value={stats.discharged} label="De alta" color="#059669" />
      </div>

      <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row gap-3">
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
            <EmptyState icon={SearchIcon} title="Sin resultados" description="No encontramos internamientos que coincidan con tu b&uacute;squeda." actionLabel="Limpiar filtros" onAction={resetFilters} />
          ) : (
            <EmptyState icon={HospitalIcon} title="No hay internamientos" description="No hay pacientes internados en este momento." />
          )
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate">Fecha y hora</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Paciente / Propietario</th>
                    <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">Contacto</th>
                    <th className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">Estado</th>
                    <th className="py-3 pr-4 pl-2 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {controls.paginatedData.map((entry: InternmentEntry) => (
                    <tr key={entry.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-sm text-slate whitespace-nowrap">{entry.date}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={entry.patient} size="sm" />
                          <div className="min-w-0">
                            <div className="text-sm text-ink font-medium">{entry.patient}</div>
                            <div className="text-xs text-slate">{entry.owner}</div>
                            {entry.note && (
                              <div className="text-xs text-slate/60 truncate max-w-[200px]" title={entry.note}>
                                {entry.note}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-sm text-slate">{entry.contact || entry.owner}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${entry.status === 'Internado' ? 'bg-amber/10 text-amber' : 'bg-success/10 text-success'}`}>
                          {entry.status === 'Internado' ? 'Internado' : 'De Alta'}
                        </span>
                      </td>
                      <td className="py-3 pr-4 pl-2">
                        <RowActionMenu
                          items={[
                            { label: 'Ver detalle', icon: EyeIcon, onClick: () => {} },
                            { label: 'Editar', icon: PenIcon, onClick: () => {} },
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
      </div>
    </section>
    </>
  );
}

export { Internments };
