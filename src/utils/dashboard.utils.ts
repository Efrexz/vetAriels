import { parseDateSafe } from '@utils/date';
import type { Payment } from "@t/financial.types";
import type { Client } from "@t/client.types";
import type { Product } from "@t/inventory.types";
import type {
  MedicalQueueItem,
  GroomingQueueItem,
} from "@t/clinical.types";

/* ------------------------------------------------------------------ */
/*  Formato de fecha/hora                                              */
/* ------------------------------------------------------------------ */

export function computeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

export function formatDateShort(): string {
  return new Date().toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatDateEyebrow(): string {
  const d = new Date();
  const weekdays = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const dow = weekdays[d.getDay()].toUpperCase();
  const day = d.getDate();
  const month = months[d.getMonth()];
  return `${dow} ${day} DE ${month.toUpperCase()}`;
}

export function formatTime(): string {
  return new Date().toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/* ------------------------------------------------------------------ */
/*  Parsers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Parser de fechas del dashboard. Debega en @utils/date.ts (parseDateSafe):
 * acepta ISO de Supabase ('yyyy-mm-dd'), dd/mm/yyyy y el formato con hora
 * de los pagos. El parseo es LOCAL: el shift UTC de new Date(string)
 * hacia que "clientes nuevos hoy" diera 0 en Lima (UTC-5).
 */
function parseDateStr(raw: string): Date | null {
  const cleaned = raw.trim();
  // Con hora incluida ("31-07-2024 07:43 AM", "29/9/2026, 10:05:23"),
  // extraemos solo la parte de fecha y computamos medianoche local.
  const dateOnly = cleaned.split(/[ T]/)[0].replace(",", "");
  return parseDateSafe(dateOnly);
}

export function parseMoney(raw: string | null | undefined): number {
  if (!raw) return 0;
  return parseFloat(raw.toString().replace(/,/g, "")) || 0;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

function isTodayDate(d: Date): boolean {
  return isSameDay(d, new Date());
}

function isYesterdayDate(d: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(d, yesterday);
}

/* ------------------------------------------------------------------ */
/*  Ventas del día                                                     */
/* ------------------------------------------------------------------ */

export interface SalesByHour {
  hour: number;
  total: number;
}

export interface TodaySales {
  total: number;
  byHour: SalesByHour[];
  deltaVsYesterday: number;
}

export function getTodaySales(payments: Payment[]): TodaySales {
  const now = new Date();

  const todayPmts = payments.filter((p) => {
    const d = parseDateStr(p.date);
    return d && isTodayDate(d) && p.movementType === "VENTA";
  });

  const yestPmts = payments.filter((p) => {
    const d = parseDateStr(p.date);
    return d && isYesterdayDate(d) && p.movementType === "VENTA";
  });

  const todayTotal = todayPmts.reduce((s, p) => s + parseMoney(p.income), 0);
  const yestTotal = yestPmts.reduce((s, p) => s + parseMoney(p.income), 0);

  const hourly: Record<number, number> = {};
  for (let h = 8; h <= 20; h++) hourly[h] = 0;
  todayPmts.forEach((p) => {
    const d = parseDateStr(p.date);
    if (d) {
      const h = d.getHours();
      hourly[h] = (hourly[h] || 0) + parseMoney(p.income);
    }
  });
  const byHour: SalesByHour[] = Object.entries(hourly).map(
    ([h, total]) => ({ hour: parseInt(h, 10), total }),
  );

  const deltaVsYesterday =
    yestTotal > 0 ? ((todayTotal - yestTotal) / yestTotal) * 100 : 0;

  return { total: todayTotal, byHour, deltaVsYesterday };
}

/* ------------------------------------------------------------------ */
/*  Clientes nuevos hoy                                                */
/* ------------------------------------------------------------------ */

export interface NewClientsStats {
  count: number;
  deltaVsYesterday: number;
}

export function getNewClientsToday(clients: Client[]): NewClientsStats {
  const todayCount = clients.filter((c) => {
    const d = parseDateStr(c.date);
    return d && isTodayDate(d);
  }).length;
  const yesterdayCount = clients.filter((c) => {
    const d = parseDateStr(c.date);
    return d && isYesterdayDate(d);
  }).length;
  const delta =
    yesterdayCount > 0
      ? ((todayCount - yesterdayCount) / yesterdayCount) * 100
      : 0;
  return { count: todayCount, deltaVsYesterday: delta };
}

/* ------------------------------------------------------------------ */
/*  Productos bajos                                                    */
/* ------------------------------------------------------------------ */

export function getLowStockProducts(products: Product[]): Product[] {
  return products
    .filter((p) => p.minStock != null && p.availableStock <= p.minStock)
    .sort((a, b) => a.availableStock - b.availableStock);
}

export function getLowStockCount(products: Product[]): number {
  return products.filter(
    (p) => p.minStock != null && p.availableStock <= p.minStock,
  ).length;
}

/* ------------------------------------------------------------------ */
/*  Agenda del día (colas unificadas)                                   */
/* ------------------------------------------------------------------ */

export interface AgendaItem {
  id: string;
  time: string;
  petName: string;
  species: "CANINO" | "FELINO";
  description: string;
  state: string;
  type: "medical" | "grooming";
}

export function normalizeState(state: string): string {
  return state.trim().toLowerCase();
}

export function stateLabel(state: string): string {
  const n = normalizeState(state);
  const labels: Record<string, string> = {
    "en atención": "En sala",
    pendiente: "Pendiente",
    "en espera": "En espera",
    terminado: "Terminado",
    suspendido: "Suspendido",
    entregado: "Entregado",
  };
  return labels[n] ?? state;
}

const STATE_COLORS: Record<string, string> = {
  "en atención": "bg-primary/10 text-primary",
  pendiente: "bg-amber/10 text-amber",
  "en espera": "bg-emerald-50 text-emerald-600",
  terminado: "bg-green-50 text-green-600",
  suspendido: "bg-danger/10 text-danger",
  entregado: "bg-slate-100 text-slate",
};

export function getStateBadgeClass(state: string): string {
  return STATE_COLORS[normalizeState(state)] ?? "bg-slate-100 text-slate";
}

const SKIPPED_STATES = new Set(["terminado", "entregado", "suspendido"]);

export function isSkippedState(state: string): boolean {
  return SKIPPED_STATES.has(normalizeState(state));
}

export function formatQueueTime(time: string): string {
  const match = time.match(/^(\d{1,2}:\d{2}):\d{2}\s*(AM|PM|am|pm)$/i);
  if (match) return `${match[1]} ${match[2].toUpperCase()}`;
  return time;
}

export function getTodayAgenda(
  medical: MedicalQueueItem[],
  grooming: GroomingQueueItem[],
): AgendaItem[] {
  const medicalItems: AgendaItem[] = medical
    .filter((q) => !isSkippedState(q.state))
    .map((q) => ({
      id: `med-${q.id}`,
      time: formatQueueTime(q.timeOfAttention),
      petName: q.petData?.petName ?? "—",
      species: q.petData?.species ?? "CANINO",
      description: q.notes || "Consulta médica",
      state: q.state,
      type: "medical" as const,
    }));

  const groomingItems: AgendaItem[] = grooming
    .filter((q) => !isSkippedState(q.state))
    .map((q) => ({
      id: `grm-${q.id}`,
      time: formatQueueTime(q.timeOfAttention),
      petName: q.petData?.petName ?? "—",
      species: q.petData?.species ?? "CANINO",
      description:
        q.productsAndServices?.[0]?.serviceName ??
        q.productsAndServices?.[0]?.productName ??
        "Peluquería",
      state: q.state,
      type: "grooming" as const,
    }));

  return [...medicalItems, ...groomingItems].sort((a, b) =>
    a.time.localeCompare(b.time),
  );
}

/* ------------------------------------------------------------------ */
/*  Breakdown cola (donut)                                             */
/* ------------------------------------------------------------------ */

export interface QueueSegment {
  label: string;
  value: number;
  color: string;
}

export function getQueueBreakdown(
  medical: MedicalQueueItem[],
  grooming: GroomingQueueItem[],
): QueueSegment[] {
  const activeMedical = medical.filter((q) => !isSkippedState(q.state));
  const activeGrooming = grooming.filter((q) => !isSkippedState(q.state));
  return [
    { label: "Consulta", value: activeMedical.length, color: "#3B82F6" },
    { label: "Peluquería", value: activeGrooming.length, color: "#F59E0B" },
  ];
}

/* ------------------------------------------------------------------ */
/*  Cuentas activas                                                    */
/* ------------------------------------------------------------------ */

export function getActiveAccountsCount(clients: Client[]): number {
  return clients.filter((c) => c.products && c.products.length > 0).length;
}

/* ------------------------------------------------------------------ */
/*  Últimos movimientos                                                */
/* ------------------------------------------------------------------ */

export interface MovementItem {
  id: string;
  description: string;
  amount: number;
  isIncome: boolean;
  date: string;
}

export function getRecentMovements(
  payments: Payment[],
  limit = 5,
): MovementItem[] {
  return payments
    .slice()
    .sort((a, b) => {
      const da = parseDateStr(a.date);
      const db = parseDateStr(b.date);
      return (db?.getTime() ?? 0) - (da?.getTime() ?? 0);
    })
    .slice(0, limit)
    .map((p) => {
      const isIncome = p.income != null && p.income !== "";
      return {
        id: p.id,
        description: p.description || p.movementType,
        amount: isIncome ? parseMoney(p.income) : parseMoney(p.expense),
        isIncome,
        date: p.date,
      };
    });
}

/* ------------------------------------------------------------------ */
/*  Formateo de montos                                                  */
/* ------------------------------------------------------------------ */

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDelta(value: number): string {
  if (value === 0) return "Sin cambios";
  const abs = Math.abs(value).toFixed(1);
  return value > 0 ? `↑ ${value.toFixed(1)}%` : `↓ ${abs}%`;
}

export function timeAgo(dateStr: string): string {
  const date = parseDateStr(dateStr);
  if (!date) return "";
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Ahora";
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Hace 1 d&iacute;a";
  if (diffDays < 30) return `Hace ${diffDays} d&iacute;as`;
  const diffMonths = Math.floor(diffDays / 30);
  return `Hace ${diffMonths} mes${diffMonths > 1 ? "es" : ""}`;
}

/* ------------------------------------------------------------------ */
/*  Recordatorios                                                      */
/* ------------------------------------------------------------------ */

export type ReminderUrgency = "urgent" | "warning" | "info";

export interface Reminder {
  id: string;
  title: string;
  subtitle: string;
  urgency: ReminderUrgency;
  path?: string;
}

export const urgencyConfig: Record<
  ReminderUrgency,
  { label: string; pillClass: string; iconClass: string }
> = {
  urgent: {
    label: "Urgente",
    pillClass: "bg-danger/10 text-danger",
    iconClass: "bg-danger/10 text-danger",
  },
  warning: {
    label: "Atenci&oacute;n",
    pillClass: "bg-warning/10 text-warning",
    iconClass: "bg-warning/10 text-warning",
  },
  info: {
    label: "Pendiente",
    pillClass: "bg-primary/10 text-primary",
    iconClass: "bg-primary/10 text-primary",
  },
};

export function getReminders(
  clients: Client[],
  products: Product[],
): Reminder[] {
  const reminders: Reminder[] = [];

  const lowStock = getLowStockProducts(products);
  if (lowStock.length > 0) {
    reminders.push({
      id: "low-stock",
      title: "Productos con stock bajo",
      subtitle: `${lowStock.length} producto${lowStock.length !== 1 ? "s" : ""} requiere${lowStock.length === 1 ? "" : "n"} reposici&oacute;n`,
      urgency: lowStock.some((p) => p.availableStock === 0) ? "urgent" : "warning",
      path: "/products",
    });
  }

  const activeAccounts = clients.filter(
    (c) => c.products && c.products.length > 0,
  );
  if (activeAccounts.length > 0) {
    reminders.push({
      id: "active-accounts",
      title: "Cuentas activas sin cobrar",
      subtitle: `${activeAccounts.length} cliente${activeAccounts.length !== 1 ? "s" : ""} con cuentas pendientes`,
      urgency: activeAccounts.length > 3 ? "urgent" : "warning",
      path: "/sales/active-orders",
    });
  }

  return reminders;
}
