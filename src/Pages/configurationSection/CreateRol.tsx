import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '@context/GlobalContext';
import { Role } from '@t/user.types';
import { generateUniqueId } from '@utils/idGenerator';
import { ActionButtons } from '@components/ui/ActionButtons';
import { FormField } from '@components/ui/FormField';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';

type FormDataState = Omit<Role, 'id'>;

function CreateRol() {
  const { addRole } = useGlobal();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormDataState>({
    name: '',
    access: 'NO',
  });
  const [error, setError] = useState<boolean>(false);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name as keyof FormDataState]: e.target.value });
    if (error) setError(false);
  }

  function addNewRole() {
    if (formData.name.trim().length < 4) {
      setError(true);
      return;
    }
    addRole({ ...formData, id: generateUniqueId() });
    navigate('/config/roles');
  }

  return (
    <section className="w-full">
      <div className="mb-6">
        <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
          Configuraci&oacute;n
        </span>
        <h1 className="text-2xl font-bold font-display text-ink">Crear Rol</h1>
      </div>

      <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label="Nombre del rol"
              id="name"
              icon={RoleUserIcon}
              value={formData.name}
              onChange={handleChange}
              error={error ? 'El nombre debe tener al menos 4 caracteres' : undefined}
              required
              placeholder="Ej: Administrador"
            />
            <FormField
              label="Acceso a cuadre de caja"
              id="access"
              as="select"
              icon={RoleUserIcon}
              value={formData.access}
              onChange={handleChange}
              options={[
                { value: 'SI', label: 'SI' },
                { value: 'NO', label: 'NO' },
              ]}
            />
          </div>
        </div>

        <ActionButtons
          onCancel={() => navigate(-1)}
          onSubmit={addNewRole}
          submitText="Crear rol"
          mode="form"
        />
      </div>
    </section>
  );
}

export { CreateRol };
