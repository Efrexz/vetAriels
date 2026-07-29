import { useState, ChangeEvent } from 'react';
import { useGlobal } from '@context/GlobalContext';
import { CompanyData } from '@t/user.types';
import { HorizontalMenu } from '@components/ui/HorizontalMenu';
import { useToast } from '@context/ToastContext';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import EmailIcon from '@assets/emailIcon.svg?react';
import PhoneIcon from '@assets/phoneIcon.svg?react';
import HospitalIcon from '@assets/hospitalIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import LocationIcon from '@assets/locationIcon.svg?react';
import FacebookIcon from '@assets/facebook.svg?react';

const formFields = [
    { label: 'Nombre de la clínica', id: 'clinicName', type: 'text', icon: HospitalIcon, required: true },
    { label: 'Correo electrónico de la clínica', id: 'email', type: 'text', icon: EmailIcon, required: true },
    { label: 'Departamento *', id: 'department', type: 'select', options: ['LIMA'] },
    { label: 'Provincia *', id: 'province', type: 'select', options: ['LIMA'] },
    { label: 'Distrito', id: 'district', type: 'select', options: ['LIMA'] },
    { label: 'Dirección', id: 'address', type: 'text', icon: LocationIcon },
    { label: 'Teléfono Fijo', id: 'landPhone', type: 'text', icon: PhoneIcon, required: true },
    { label: 'Celular', id: 'phone', type: 'text', icon: PhoneIcon },
    { label: 'Facebook', id: 'facebook', type: 'text', icon: FacebookIcon },
];

const themeColorList = [
    { name: 'Teal', color: '#0D9488' },
    { name: 'Azul', color: '#3B82F6' },
    { name: 'Verde', color: '#10B981' },
    { name: 'Ámbar', color: '#D97706' },
    { name: 'Violeta', color: '#8B5CF6' },
    { name: 'Coral', color: '#F43F5E' },
    { name: 'Gris', color: '#64748B' },
];


function Config() {

    const { companyData, setCompanyData, themeColor, setThemeColor } = useGlobal();
    const { toast } = useToast();

    const [formData, setFormData] = useState<CompanyData>({
        clinicName: companyData.clinicName || '',
        email: companyData.email || '',
        department: companyData.department || '',
        province: companyData.province || '',
        district: companyData.district || '',
        address: companyData.address || '',
        phone: companyData.phone || '',
        facebook: companyData.facebook || '',
    });

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value,
        }));
    }

    function updateCompanyData() {
        const updatedCompanyData = {
            ...companyData,
            clinicName: formData.clinicName,
            email: formData.email,
            department: formData.department,
            province: formData.province,
            district: formData.district,
            address: formData.address,
            phone: formData.phone,
            facebook: formData.facebook,
        };
        toast.success("Datos actualizados con exito");
        setCompanyData(updatedCompanyData);
    }

    function handleThemeChange(colorName: string) {
        setThemeColor(colorName);
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
                    General
                </span>
                <h1 className="text-2xl font-bold font-display text-ink">
                    Configuraci&oacute;n de la cl&iacute;nica
                </h1>
            </div>
            <div className="mb-5">
                <HorizontalMenu mode="clinics" />
            </div>

            {/* Selector de color de tema */}
            <div className="bg-paper shadow-sm rounded-2xl p-6 mb-6 border border-slate-200">
                <h3 className="text-base font-semibold text-ink mb-4 font-display">Color del tema</h3>
                <div className="flex flex-wrap gap-3">
                    {themeColorList.map((theme) => (
                        <button
                            key={theme.color}
                            onClick={() => handleThemeChange(theme.name)}
                            className={`w-10 h-10 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                                themeColor === theme.name
                                    ? 'border-ink shadow-md scale-110'
                                    : 'border-slate-300 hover:border-slate'
                            }`}
                            style={{ backgroundColor: theme.color }}
                            title={theme.name}
                        />
                    ))}
                </div>
                <p className="text-slate text-sm mt-3">
                    Color actual: <span className="font-semibold text-ink">{themeColor}</span>
                    &mdash; Los cambios se reflejar&aacute;n en una versi&oacute;n futura.
                </p>
            </div>
            <div className="flex flex-col md:flex-row bg-paper shadow-sm rounded-2xl overflow-hidden border border-slate-200">
                <div className="w-full md:w-1/4 p-6 bg-slate-50/50 flex flex-col items-center justify-center border-r border-slate-200">
                    <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mb-3">
                        <RoleUserIcon className="w-12 h-12 text-primary" />
                    </div>
                </div>

                <div className="w-full md:w-3/4 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formFields.map((field, index) => (
                            <div key={index}>
                                <label className="block text-sm font-medium text-ink mb-1.5">{field.label}</label>
                                <div className="flex items-center">
                                    {field.icon &&
                                        <div className="flex items-center justify-center bg-white px-3 py-2 rounded-l-lg border border-slate-200 border-r-0">
                                            <field.icon className="w-5 h-5 text-slate" />
                                        </div>
                                    }

                                    {field.type === 'select' ? (
                                        <select
                                            id={field.id}
                                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white w-full text-ink focus:outline-none focus:border-primary hover:border-primary"
                                            value={formData[field.id as keyof CompanyData]}
                                            onChange={handleChange}
                                        >
                                            {field.options?.map((option, i) => (
                                                <option key={i} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            className="border rounded-r-lg px-3 py-2 text-sm bg-white w-full text-ink focus:outline-none focus:border-primary hover:border-primary border-slate-200"
                                            type={field.type}
                                            id={field.id}
                                            value={formData[field.id as keyof CompanyData]}
                                            onChange={handleChange}
                                            required={field.required}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-end items-center py-4 pt-4">
                <button
                    className="bg-primary text-white py-2 px-5 rounded-xl hover:opacity-90 flex items-center gap-2 text-sm font-semibold font-display shadow-sm shadow-primary/25 transition-colors"
                    onClick={updateCompanyData}
                >
                    <PlusIcon className="w-4 h-4" />
                    Actualizar
                </button>
            </div>
        </div>
    );
}

export { Config };

