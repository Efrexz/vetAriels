import { Link } from "react-router-dom";
import PawIcon from "@assets/pawIcon.svg?react";
import CalendarIcon from "@assets/calendarIcon.svg?react";
import heroPetsJpg from "@assets/hero-pets.jpg";

interface HeroCardProps {
  formatDateEyebrow: () => string;
  formatTime: () => string;
  computeGreeting: () => string;
  activeUserName?: string;
  clinicName?: string;
}

function HeroCard({
  formatDateEyebrow,
  formatTime,
  computeGreeting,
  activeUserName,
  clinicName,
}: HeroCardProps) {
  return (
    <section className="relative card overflow-hidden bg-gradient-to-br from-primary/[0.06] via-white to-white">
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="flex-1 p-5 sm:p-7 md:pr-0">
          <span className="block text-[13px] text-slate uppercase tracking-[0.15em] font-medium mb-1">
            {formatDateEyebrow()} &middot; {formatTime()}
          </span>
          <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-bold font-display text-ink leading-tight">
            <PawIcon className="w-6 h-6 md:w-7 md:h-7 text-primary flex-shrink-0" />
            <span>
              &#161;{computeGreeting()}, {activeUserName || "Usuario"}!
            </span>
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
            <CalendarIcon className="w-4 h-4" />
            Ver agenda del d&iacute;a
          </Link>
        </div>

        <div className="hidden md:block w-64 lg:w-72 xl:w-80 flex-shrink-0 self-stretch relative overflow-hidden">
          <img
            src={heroPetsJpg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover rounded-r-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}

export { HeroCard };
