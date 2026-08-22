import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsersMutations } from '@hooks/useUsersQuery';
import { ActionButtons } from '@components/ui/ActionButtons';
import { FormField } from '@components/ui/FormField';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import EmailIcon from '@assets/emailIcon.svg?react';
import PhoneIcon from '@assets/phoneIcon.svg?react';
import PadLockIcon from '@assets/padLockIcon.svg?react';

interface FormDataState {
  email: string;
  password: string;
  name: string;
  lastName: string;
  phone: string;
  rol: string;
}

type FormErrors = Partial<Record<keyof FormDataState, string>>;

const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'VETERINARIO', label: 'Veterinario' },
  { value: 'RECEPCIONISTA', label: 'Recepcionista' },
  { value: 'GROOMER', label: 'Groomer' },
];

function CreateUser() {
  const { create } = useUsersMutations();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormDataState>({
    email: '',
    password: '',
    name: '',
    lastName: '',
    phone: '',
    rol: 'RECEPCIONISTA',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validateForm(): boolean {
    const newErrors: FormErrors = {};
    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }
    if (!formData.lastName || formData.lastName.trim().length < 3) {
      newErrors.lastName = 'El apellido debe tener al menos 3 caracteres';
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'El correo electronico no es valido';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'La contrasena debe tener al menos 6 caracteres';
    }
    if (!/^\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'El telefono debe tener 9 digitos';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function createNewUser() {
    if (!validateForm()) return;
    setSubmitError(null);

    try {
      await create.mutateAsync({
        email: formData.email,
        password: formData.password,
        first_name: formData.name,
        last_name: formData.lastName,
        phone: formData.phone,
        role: formData.rol as 'ADMIN' | 'VETERINARIO' | 'RECEPCIONISTA' | 'GROOMER',
      });
      navigate('/config/user-subsidiaries');
    } catch (err) {
      const raw = err instanceof Error ? err.message : 'Error al crear usuario';
      // Mapeamos errores tecnicos de Supabase a mensajes en espanol claros.
      let userMessage = raw;
      if (/already registered|already exists/i.test(raw)) {
        userMessage = `Ya existe un usuario con el correo "${formData.email}". Usa otro correo o desactiva el usuario existente.`;
      } else if (/password/i.test(raw) && /short|6/i.test(raw)) {
        userMessage = 'La contrasena debe tener al menos 6 caracteres.';
      } else if (/email/i.test(raw) && /invalid/i.test(raw)) {
        userMessage = 'El formato del correo electronico no es valido.';
      }
      setSubmitError(userMessage);
    }
  }

  return (
    <section className="w-full">
      <div className="mb-6">
        <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
          Configuracion
        </span>
        <h1 className="text-2xl font-bold font-display text-ink">Crear Usuario</h1>
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
              placeholder="Nombre del usuario"
            />
            <FormField
              label="Apellido"
              id="lastName"
              icon={RoleUserIcon}
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required
              placeholder="Apellido del usuario"
            />
            <FormField
              label="Correo electronico"
              id="email"
              type="email"
              icon={EmailIcon}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              placeholder="usuario@clinica.com"
            />
            <FormField
              label="Contrasena"
              id="password"
              type="password"
              icon={PadLockIcon}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              placeholder="Minimo 6 caracteres"
            />
            <FormField
              label="Telefono"
              id="phone"
              type="tel"
              icon={PhoneIcon}
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              required
              placeholder="999888777"
            />
            <FormField
              label="Rol"
              id="rol"
              as="select"
              icon={RoleUserIcon}
              value={formData.rol}
              onChange={handleChange}
              error={errors.rol}
              options={ROLE_OPTIONS}
            />
          </div>

          {submitError && (
            <p className="text-danger text-sm mt-4" role="alert">
              {submitError}
            </p>
          )}
        </div>

        <ActionButtons
          onCancel={() => navigate(-1)}
          onSubmit={createNewUser}
          submitText={create.isPending ? 'Creando...' : 'Crear usuario'}
          mode="form"
          disabled={create.isPending}
        />
      </div>
    </section>
  );
}

export { CreateUser };