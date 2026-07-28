import { Link, useNavigate } from "react-router-dom";
import { useClients } from "@context/ClientsContext";

interface PatientQueueMenuProps {
  onClose: () => void;
}

export function PatientQueueMenu({ onClose }: PatientQueueMenuProps) {
  const { petsInQueueMedical } = useClients();
  const navigate = useNavigate();

  function handleItemClick(petId: string) {
    navigate(`/pets/pet/${petId}/update`);
    onClose();
  }

  function handleGoToClinicQueueClick() {
    navigate("/clinic-queue");
    onClose();
  }

  return (
    <div className="absolute top-16 right-4 md:right-24 bg-paper shadow-xl rounded-2xl w-72 z-50 border border-slate-200 overflow-hidden flex flex-col max-h-[380px]">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between flex-shrink-0">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-primary font-display">
            En Espera M&eacute;dica
          </h4>
          <p className="text-[11px] text-slate mt-0.5">
            {petsInQueueMedical.length} mascota{petsInQueueMedical.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {petsInQueueMedical.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-slate">
            Sin pacientes en espera
          </p>
        ) : (
          <ul>
            {petsInQueueMedical.map((pet) => {
              const initial = (pet?.petData?.petName || "?").charAt(0).toUpperCase();
              const species = pet?.petData?.species || "CANINO";
              return (
                <li
                  key={pet.id}
                  className="px-4 py-3 border-t border-slate-50 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => handleItemClick(pet.petData.id)}
                >
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold font-display ${
                      species === "CANINO"
                        ? "bg-primary/10 text-primary"
                        : "bg-violet-50 text-violet-500"
                    }`}
                  >
                    {initial}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink truncate">
                      {pet?.petData?.petName}
                    </p>
                    <p className="text-xs text-slate">{pet?.timeOfAttention}</p>
                  </div>
                  {pet.state.trim().toLowerCase().includes("atenc") && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary flex-shrink-0">
                      En sala
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-200 flex-shrink-0">
        <Link
          className="text-primary text-sm font-medium text-center block hover:underline"
          onClick={handleGoToClinicQueueClick}
          to="/clinic-queue"
        >
          Gestionar Sala de Espera
        </Link>
      </div>
    </div>
  );
}
