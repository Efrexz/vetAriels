import { Link } from "react-router-dom";
import PawIcon from "@assets/pawIcon.svg?react";
import Stethoscope from "@assets/stethoscope.svg?react";
import ScissorsIcon from "@assets/scissorsIcon.svg?react";
import BagShoppingIcon from "@assets/bagShopping.svg?react";

interface HeroCardProps {
  formatDateEyebrow: () => string;
  formatTime: () => string;
  computeGreeting: () => string;
  activeUserName?: string;
  clinicName?: string;
  queueMedicalTotal: number;
  queueGroomingTotal: number;
  activeAccounts: number;
}

function HeroCard({
  formatDateEyebrow,
  formatTime,
  computeGreeting,
  activeUserName,
  clinicName,
  queueMedicalTotal,
  queueGroomingTotal,
  activeAccounts,
}: HeroCardProps) {
  return (
    <section className="relative bg-gradient-to-br from-primary/8 via-white to-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
      <div className="p-5 sm:p-7">
        <span className="block text-xs text-slate uppercase tracking-[0.15em] font-medium mb-1">
          {formatDateEyebrow()} &middot; {formatTime()}
        </span>
        <h1 className="text-2xl md:text-3xl font-bold font-display text-ink leading-tight">
          &#161;{computeGreeting()}, {activeUserName || "Usuario"}!
        </h1>
        {clinicName && (
          <p className="mt-1.5 text-slate text-sm max-w-lg">
            Gracias por tu dedicaci&oacute;n. Aqu&iacute; tienes un resumen de la
            actividad de hoy en {clinicName}.
          </p>
        )}

        <Link
          to="/clinic-queue"
          className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold font-display hover:opacity-90 transition-opacity shadow-sm shadow-primary/25"
        >
          Ver agenda del d&iacute;a
        </Link>
      </div>

      <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 hidden md:block">
        <div className="bg-paper rounded-xl border border-slate-200 shadow-sm px-5 py-4 w-56">
          <p className="text-xs font-semibold text-slate uppercase tracking-wider mb-3">
            Resumen del d&iacute;a
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Stethoscope className="w-4 h-4 text-primary" />
              </span>
              <div>
                <p className="text-lg font-bold font-display text-ink leading-none">
                  {queueMedicalTotal}
                </p>
                <p className="text-xs text-slate">En espera</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center flex-shrink-0">
                <ScissorsIcon className="w-4 h-4 text-amber" />
              </span>
              <div>
                <p className="text-lg font-bold font-display text-ink leading-none">
                  {queueGroomingTotal}
                </p>
                <p className="text-xs text-slate">Peluquer&iacute;a</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <BagShoppingIcon className="w-4 h-4 text-emerald-600" />
              </span>
              <div>
                <p className="text-lg font-bold font-display text-ink leading-none">
                  {activeAccounts}
                </p>
                <p className="text-xs text-slate">Cuentas activas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PawIcon className="absolute -right-10 -bottom-10 h-48 w-48 text-primary/5 pointer-events-none rotate-12" />
    </section>
  );
}

export { HeroCard };
