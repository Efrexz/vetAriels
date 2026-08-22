import { useState, useEffect, useRef } from 'react';
import type { ComponentType } from 'react';

interface RowActionMenuItem {
  label: string;
  icon: ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

interface RowActionMenuDivider {
  divider: true;
}

type RowActionMenuEntry = RowActionMenuItem | RowActionMenuDivider;

interface RowActionMenuProps {
  items: RowActionMenuEntry[];
}

function isDivider(entry: RowActionMenuEntry): entry is RowActionMenuDivider {
  return 'divider' in entry && entry.divider === true;
}

function RowActionMenu({ items }: RowActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-row-menu]')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  function handleItemClick(item: RowActionMenuItem) {
    setIsOpen(false);
    item.onClick();
  }

  return (
    <div className="relative" data-row-menu ref={menuRef}>
      <button
        data-row-menu
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="p-1.5 rounded-lg text-slate hover:text-ink hover:bg-slate-100 transition-colors"
        aria-label="Opciones"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="opacity-60"
        >
          <circle cx="8" cy="3" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="13" r="1.5" />
        </svg>
      </button>

      {isOpen && (
        <div
          data-row-menu
          className="absolute right-0 mt-1 w-44 bg-paper border border-slate-200 rounded-xl shadow-lg py-1 z-20"
        >
          {items.map((entry, idx) =>
            isDivider(entry) ? (
              <div
                key={`divider-${idx}`}
                className="border-t border-slate-100 my-1"
              />
            ) : (
              <button
                key={entry.label}
                disabled={entry.disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemClick(entry);
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2.5 ${
                  entry.danger
                    ? 'text-danger hover:bg-danger/5'
                    : 'text-slate hover:bg-slate-50 hover:text-ink'
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent`}
              >
                <entry.icon className="w-4 h-4" />
                {entry.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

export { RowActionMenu };
