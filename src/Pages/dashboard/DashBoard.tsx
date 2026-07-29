import { useMemo } from "react";
import { useGlobal } from "@context/GlobalContext";
import { useClients } from "@context/ClientsContext";
import { useProductsAndServices } from "@context/ProductsAndServicesContext";
import { useFinancial } from "@context/FinancialContext";
import Stethoscope from "@assets/stethoscope.svg?react";
import BathIcon from "@assets/bathIcon.svg?react";
import NewUserIcon from "@assets/newUserIcon.svg?react";
import BoxesIcon from "@assets/boxesIcon.svg?react";

import { HeroCard } from "./components/HeroCard";
import { KpiCard } from "./components/KpiCard";
import { AgendaCard } from "./components/AgendaCard";
import { SalesChartCard } from "./components/SalesChartCard";
import { QueueDonutCard } from "./components/QueueDonutCard";
import { RecentMovementsCard } from "./components/RecentMovementsCard";
import { RemindersCard } from "./components/RemindersCard";

import {
  isSkippedState,
  computeGreeting,
  formatDateEyebrow,
  formatTime,
  getTodaySales,
  getNewClientsToday,
  getLowStockCount,
  getTodayAgenda,
  getQueueBreakdown,
  getRecentMovements,
  getReminders,
  formatDelta,
} from "@utils/dashboard.utils";

function DashBoard() {
  const { activeUser, companyData } = useGlobal();
  const { clients, petsInQueueMedical, petsInQueueGrooming } = useClients();
  const { productsData } = useProductsAndServices();
  const { paymentsData } = useFinancial();

  const todaySales = useMemo(
    () => getTodaySales(paymentsData),
    [paymentsData],
  );
  const newClients = useMemo(
    () => getNewClientsToday(clients),
    [clients],
  );
  const lowStockCount = useMemo(
    () => getLowStockCount(productsData),
    [productsData],
  );
  const agenda = useMemo(
    () => getTodayAgenda(petsInQueueMedical, petsInQueueGrooming),
    [petsInQueueMedical, petsInQueueGrooming],
  );
  const queueBreakdown = useMemo(
    () => getQueueBreakdown(petsInQueueMedical, petsInQueueGrooming),
    [petsInQueueMedical, petsInQueueGrooming],
  );
  const queueTotal = useMemo(
    () =>
      petsInQueueMedical.filter((q) => !isSkippedState(q.state)).length +
      petsInQueueGrooming.filter((q) => !isSkippedState(q.state)).length,
    [petsInQueueMedical, petsInQueueGrooming],
  );
  const recentMovements = useMemo(
    () => getRecentMovements(paymentsData, 5),
    [paymentsData],
  );
  const reminders = useMemo(
    () => getReminders(clients, productsData),
    [clients, productsData],
  );

  return (
    <main className="px-4 sm:px-6 py-4 space-y-5">
      {/* HERO */}
      <div className="animate-fade-in animate-stagger-1">
        <HeroCard
          formatDateEyebrow={formatDateEyebrow}
          formatTime={formatTime}
          computeGreeting={computeGreeting}
          activeUserName={activeUser?.name}
          clinicName={companyData?.clinicName}
        />
      </div>

      {/* KPIs */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 animate-fade-in animate-stagger-2">
        <KpiCard
          icon={Stethoscope}
          color="#3B82F6"
          value={petsInQueueMedical.length}
          label="Cola m&eacute;dica"
          caption="En espera"
        />
        <KpiCard
          icon={BathIcon}
          color="#F59E0B"
          value={petsInQueueGrooming.length}
          label="Peluquer&iacute;a"
          caption="Programadas"
        />
        <KpiCard
          icon={NewUserIcon}
          color="#10B981"
          value={newClients.count}
          label="Clientes nuevos"
          caption="Hoy"
          deltaText={`${formatDelta(newClients.deltaVsYesterday)} respecto a ayer`}
        />
        <KpiCard
          icon={BoxesIcon}
          color="#8B5CF6"
          value={lowStockCount}
          label="Productos bajos"
          caption="Requieren atenci&oacute;n"
        />
      </section>

      {/* MAIN GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 animate-fade-in animate-stagger-3">
        <div className="lg:col-span-1 xl:col-span-1">
          <AgendaCard items={agenda} />
        </div>

        <div className="lg:col-span-1 xl:col-span-1">
          <SalesChartCard
            total={todaySales.total}
            deltaVsYesterday={todaySales.deltaVsYesterday}
            byHour={todaySales.byHour}
          />
        </div>

        <div className="lg:col-span-1 xl:col-span-1">
          <QueueDonutCard segments={queueBreakdown} total={queueTotal} />
        </div>
      </section>

      {/* BOTTOM ROW */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in animate-stagger-4">
        <RecentMovementsCard movements={recentMovements} />
        <RemindersCard reminders={reminders} />
      </section>

      {/* FOOTER */}
      <p className="text-center text-xs text-slate pb-2">
        Gracias por hacer la diferencia en la vida de tantas mascotas. 💙
      </p>
    </main>
  );
}

export { DashBoard };
