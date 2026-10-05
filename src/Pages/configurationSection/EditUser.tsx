import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGlobal } from '@context/GlobalContext';
import { useToast } from '@context/ToastContext';
import { User } from '@t/user.types';
import { NotFound } from '@components/ui/NotFound';
import { ActionButtons } from '@components/ui/ActionButtons';
import { FormField } from '@components/ui/FormField';
import { InfoBanner } from '@components/ui/InfoBanner';
import { ROLES_FROM_ES } from '../../services/profilesService';
import EmailIcon from '@assets/emailIcon.svg?react';
import PhoneIcon from '@assets/phoneIcon.svg?react';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';

// Opciones de rol de la DB (UserRole) con etiquetas en espanol.
// NO se usan los roles de localStorage: la DB solo acepta el enum
// ('ADMIN' | 'VETERINARIO' | 'RECEPCIONISTA' | 'GROOMER').
const ROL_OPTIONS = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'VETERINARIO', label: 'Veterinario' },
  { value: 'RECEPCIONISTA', label: 'Recepcionista' },
  { value: 'GROOMER', label: 'Groomer' },
];

interface FormDataState {
  email: string;
  name: string;
  lastName: string;
  phone: string;
  rol: string;
  status: 'ACTIVO' | 'INACTIVO';
}

type FormErrors = Partial<Record<keyof FormDataState, string>>;

function EditUser() {
  const { users, updateUserData } = useGlobal();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const individualUserData = users.find((user) => user.id === id);

  const [formData, setFormData] = useState<FormDataState>({
    email: '',
    name: '',
    lastName: '',
    phone: '',
    rol: '',
    status: 'ACTIVO',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (individualUserData) {
      setFormData({
        email: individualUserData.email || '',
        name: individualUserData.name || '',
        lastName: individualUserData.lastName || '',
        phone: individualUserData.phone || '',
        // individualUserData.rol llega como etiqueta espanol
        // ("Administrador"); el select guarda el enum de la DB.
        rol: ROLES_FROM_ES[individualUserData.rol] || individualUserData.rol,
        status: individualUserData.status || 'INACTIVO',
      });
    }
  }, [individualUserData]);

  function validateForm() {
    const newErrors: FormErrors = {};
    if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }
    if (formData.lastName.trim().length < 3) {
      newErrors.lastName = 'El apellido debe tener al menos 3 caracteres';
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    if (!/^\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'El teléfono debe tener 9 dígitos';
    }
    if (!formData.rol) {
      newErrors.rol = 'Debe seleccionar un rol';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  }

  async function updateUserInfo() {
    if (!validateForm() || !id) return;
    const updateData: Partial<User> = {
      email: formData.email,
      name: formData.name,
      lastName: formData.lastName,
      phone: formData.phone,
      rol: formData.rol,
      status: formData.status,
    };
    setIsSubmitting(true);
    try {
      await updateUserData(id, updateData);
      toast.success('Usuario actualizado correctamente.');
      navigate('/config/user-subsidiaries');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo actualizar el usuario.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!individualUserData) {
    return <NotFound entityName="Usuario" searchId={id!} returnPath="/config/user-subsidiaries" />;
  }

  return (
    <section className="w-full">
      <div className="mb-6">
        <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
          Configuraci&oacute;n
        </span>
        <h1 className="text-2xl font-bold font-display text-ink">Editar Usuario</h1>
      </div>

      <div className="mb-4">
        <InfoBanner type="info">
          Los datos personales del usuario solo pueden ser editados desde su propio perfil.
        </InfoBanner>
      </div>

      <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label="Nombre"
              id="name"
              icon={RoleUserIcon}
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />
            <FormField
              label="Apellido"
              id="lastName"
              icon={RoleUserIcon}
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required
            />
            <FormField
              label="Correo electrónico"
              id="email"
              type="email"
              icon={EmailIcon}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <FormField
              label="Teléfono móvil"
              id="phone"
              type="tel"
              icon={PhoneIcon}
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              required
            />
            <FormField
              label="Estado"
              id="status"
              as="select"
              icon={RoleUserIcon}
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'ACTIVO', label: 'Activo' },
                { value: 'INACTIVO', label: 'Inactivo' },
              ]}
            />
            <FormField
              label="Rol"
              id="rol"
              as="select"
              icon={RoleUserIcon}
              value={formData.rol}
              onChange={handleChange}
              error={errors.rol}
              options={ROL_OPTIONS}
            />
          </div>
        </div>

        <ActionButtons
          onCancel={() => navigate(-1)}
          onSubmit={updateUserInfo}
          submitText={isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          mode="form"
          disabled={isSubmitting}
        />
      </div>
    </section>
  );
}

export { EditUser };
