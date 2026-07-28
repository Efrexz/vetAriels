import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '@context/GlobalContext';
import { User } from '@t/user.types';
import { generateUniqueId } from '@utils/idGenerator';
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

function CreateUser() {
  const { addUser, roles } = useGlobal();
  const navigate = useNavigate();
  const roleNames = roles.map((role) => role.name);

  const [formData, setFormData] = useState<FormDataState>({
    email: '',
    password: '',
    name: '',
    lastName: '',
    phone: '',
    rol: roleNames[0] || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  function validateForm(): boolean {
    const newErrors: FormErrors = {};
    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }
    if (!formData.lastName || formData.lastName.trim().length < 3) {
      newErrors.lastName = 'El apellido debe tener al menos 3 caracteres';
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!/^\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'El teléfono debe tener 9 dígitos';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function createNewUser() {
    if (!validateForm()) return;
    const now = new Date();
    const newUser: User = {
      id: generateUniqueId(),
      email: formData.email,
      password: formData.password,
      name: formData.name,
      lastName: formData.lastName,
      userName: `${formData.lastName.toUpperCase()} ${formData.name.toUpperCase()}`,
      phone: formData.phone,
      rol: formData.rol || roleNames[0],
      registrationDate: now.toLocaleDateString(),
      registrationTime: now.toLocaleTimeString(),
      status: 'ACTIVO',
    };
    addUser(newUser);
    navigate('/config/user-subsidiaries');
  }

  return (
    <section className="w-full">
      <div className="mb-6">
        <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
          Configuraci&oacute;n
        </span>
        <h1 className="text-2xl font-bold font-display text-ink">
          Crear Usuario
        </h1>
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
              label="Correo electrónico"
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
              label="Contraseña"
              id="password"
              type="password"
              icon={PadLockIcon}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              placeholder="Mínimo 6 caracteres"
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
              options={roleNames.map((n) => ({ value: n, label: n }))}
            />
          </div>
        </div>

        <ActionButtons
          onCancel={() => navigate(-1)}
          onSubmit={createNewUser}
          submitText="Crear usuario"
          mode="form"
        />
      </div>
    </section>
  );
}

export { CreateUser };
