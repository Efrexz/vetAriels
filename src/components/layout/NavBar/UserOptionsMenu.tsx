import { useNavigate } from "react-router-dom";
import { useGlobal } from "@context/GlobalContext";
import DocumentOutIcon from "@assets/documentOutIcon.svg?react";
import StoreIcon from "@assets/storeIcon.svg?react";

interface UserOptionsMenuProps {
  onClose: () => void;
}

export function UserOptionsMenu({ onClose }: UserOptionsMenuProps) {
  const { activeUser, logout } = useGlobal();
  const navigate = useNavigate();

  function handleProfileClick() {
    navigate(`/config/profile/${activeUser?.id}/update`);
    onClose();
  }

  function handleLogout() {
    navigate("/login");
    logout();
    onClose();
  }

  const userInitial = (activeUser?.name || "U").charAt(0).toUpperCase();
  const userRole = activeUser?.rol || "";

  return (
    <div className="absolute top-16 right-4 bg-paper shadow-xl rounded-2xl w-72 z-50 border border-slate-200 overflow-hidden flex flex-col">
      <div
        className="px-4 py-4 flex items-center gap-3 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={handleProfileClick}
      >
        <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold font-display flex-shrink-0">
          {userInitial}
        </span>
        <div className="leading-tight min-w-0">
          <p className="text-sm font-semibold text-ink truncate">
            {activeUser?.name}
          </p>
          <p className="text-xs text-slate truncate">{activeUser?.email}</p>
          <span className="inline-block mt-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
            {userRole}
          </span>
        </div>
      </div>

      <div className="py-1">
        <button
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-slate-50 transition-colors"
          onClick={handleLogout}
        >
          <DocumentOutIcon className="w-5 h-5 text-slate flex-shrink-0" />
          Cerrar Sesi&oacute;n
        </button>
        <button
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-slate-50 transition-colors"
          onClick={handleLogout}
        >
          <DocumentOutIcon className="w-5 h-5 text-slate flex-shrink-0" />
          Cerrar todas las Sesiones
        </button>
      </div>

      <div className="border-t border-slate-100 pt-1 pb-2">
        <p className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Cambiar de Sede:
        </p>
        <button className="w-full text-left px-4 py-2 text-sm text-ink hover:bg-slate-50 transition-colors">
          [1570] OLGA BUSTINZA
        </button>
        <button className="w-full text-left px-4 py-2 text-sm text-ink hover:bg-slate-50 transition-colors">
          [1571] VETERINARIA ARIEL&acute;S EIRL
        </button>
      </div>
    </div>
  );
}
