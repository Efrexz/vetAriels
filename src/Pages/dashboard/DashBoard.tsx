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
import { LowStockCard } from "./components/LowStockCard";
import { RecentMovementsCard } from "./components/RecentMovementsCard";

import {
  isSkippedState,
  computeGreeting,
  formatDateEyebrow,
  formatTime,
  getTodaySales,
  getNewClientsToday,
  getLowStockProducts,
  getLowStockCount,
  getTodayAgenda,
  getQueueBreakdown,
  getActiveAccountsCount,
  getRecentMovements,
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
  const lowStock = useMemo(
    () => getLowStockProducts(productsData),
    [productsData],
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
  const activeAccounts = useMemo(
    () => getActiveAccountsCount(clients),
    [clients],
  );
  const recentMovements = useMemo(
    () => getRecentMovements(paymentsData, 5),
    [paymentsData],
  );

  return (
    <main className="px-4 sm:px-6 py-4 space-y-5">
      {/* HERO */}
      <HeroCard
        formatDateEyebrow={formatDateEyebrow}
        formatTime={formatTime}
        computeGreeting={computeGreeting}
        activeUserName={activeUser?.name}
        clinicName={companyData?.clinicName}
        queueMedicalTotal={petsInQueueMedical.length}
        queueGroomingTotal={petsInQueueGrooming.length}
        activeAccounts={activeAccounts}
      />

      {/* KPIs */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          icon={Stethoscope}
          color="#3B82F6"
          value={petsInQueueMedical.length}
          label="Cola m&eacute;dica"
        />
        <KpiCard
          icon={BathIcon}
          color="#F59E0B"
          value={petsInQueueGrooming.length}
          label="Peluquer&iacute;a"
        />
        <KpiCard
          icon={NewUserIcon}
          color="#10B981"
          value={newClients.count}
          label="Clientes nuevos"
          deltaText={`${formatDelta(newClients.deltaVsYesterday)} respecto a ayer`}
        />
        <KpiCard
          icon={BoxesIcon}
          color="#8B5CF6"
          value={lowStockCount}
          label="Productos bajos"
        />
      </section>

      {/* MAIN GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
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
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <LowStockCard products={lowStock} />
        <RecentMovementsCard movements={recentMovements} />
      </section>

      {/* FOOTER */}
      <p className="text-center text-xs text-slate pb-2">
        Gracias por hacer la diferencia en la vida de tantas mascotas. 💙
      </p>
    </main>
  );
}

export { DashBoard };
