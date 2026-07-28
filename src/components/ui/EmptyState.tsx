import type { ComponentType } from 'react';

interface EmptyStateProps {
  icon: ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-primary/60" />
      </div>
      <h3 className="text-lg font-display font-semibold text-ink mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-slate max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-primary text-white py-2 px-5 rounded-xl hover:opacity-90 transition-colors font-semibold font-display shadow-sm shadow-primary/25"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export { EmptyState };
