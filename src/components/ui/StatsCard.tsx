import type { ComponentType } from 'react';

interface StatsCardProps {
  icon: ComponentType<React.SVGProps<SVGSVGElement>>;
  value: number;
  label: string;
  color: string;
}

function StatsCard({ icon: Icon, value, label, color }: StatsCardProps) {
  return (
    <div className="bg-paper rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
      <span
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: color + '1A' }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </span>
      <p className="text-2xl sm:text-3xl font-bold font-display text-ink mt-3 leading-none">
        {value}
      </p>
      <p className="text-xs text-slate mt-1">{label}</p>
    </div>
  );
}

export { StatsCard };
