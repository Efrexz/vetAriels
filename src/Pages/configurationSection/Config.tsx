import { useState, ChangeEvent } from 'react';
import { useGlobal } from '@context/GlobalContext';
import { CompanyData } from '@t/user.types';
import { HorizontalMenu } from '@components/ui/HorizontalMenu';
import { SuccessModal } from "@components/modals/SuccessModal";
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
    { color: 'blue', bgClass: 'bg-blue-400', hoverClass: 'hover:bg-blue-500' },
    { color: 'red', bgClass: 'bg-red-400', hoverClass: 'hover:bg-red-500' },
    { color: 'green', bgClass: 'bg-green-400', hoverClass: 'hover:bg-green-500' },
    { color: 'yellow', bgClass: 'bg-yellow-400', hoverClass: 'hover:bg-yellow-500' },
    { color: 'purple', bgClass: 'bg-purple-400', hoverClass: 'hover:bg-purple-500' },
    { color: 'gray', bgClass: 'bg-gray-400', hoverClass: 'hover:bg-gray-500' },
];


function Config() {

    const { setThemeColor, companyData, setCompanyData } = useGlobal();
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
    console.log(companyData);

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
        setIsSuccessModalOpen(true);
        setCompanyData(updatedCompanyData);
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <HorizontalMenu mode="user" />
            </div>
            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-t-lg overflow-hidden">
                <div className="w-full md:w-1/3 p-6 bg-gray-100 flex flex-col items-center justify-center">
                    <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                        <RoleUserIcon className="w-16 h-16 text-gray-500" />
                    </div>
                </div>

                <div className="w-full md:w-2/3 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {formFields.map((field, index) => (
                            <div key={index}>
                                <label className="block text-gray-600">{field.label}</label>
                                <div className="flex items-center ">
                                    {field.icon &&
                                        <div className="flex items-center justify-center bg-gray-100 px-3 py-3.5 rounded-l-lg">
                                            <field.icon className="w-5 h-5 text-gray-600" />
                                        </div>
                                    }

                                    {field.type === 'select'  && field.options? (
                                        <select
                                            id={field.id}
                                            className="border rounded-lg p-3 bg-gray-50 w-full hover:border-blue-300 focus-within:border-blue-300"
                                            value={formData[field.id as keyof CompanyData]}
                                            onChange={handleChange}
                                        >
                                            {field.options.map((option, i) => (
                                                <option key={i} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            className="border rounded-r-lg p-3 bg-gray-50 w-full hover:border-blue-300 focus-within:border-blue-300"
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
                    <div className="items-center mt-6 w-[70%]">
                        <h2>Temas</h2>
                        <div className='gap-4 mt-4 flex flex-wrap'>
                            {themeColorList.map((theme, index) => (
                                <button
                                    key={index}
                                    className={`${theme.bgClass} text-white py-3 px-5 w-28 rounded ${theme.hoverClass}`}
                                    onClick={() => setThemeColor(theme.color)}
                                >
                                    {theme.color}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex justify-end items-center bg-gray-100 py-3 px-5 shadow-lg rounded-b-lg'>
                <button
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3"
                    onClick={updateCompanyData}
                >
                    <PlusIcon className="w-5 h-5 text-white" />
                    ACTUALIZAR
                </button>
            </div>
            {
                isSuccessModalOpen && (
                    <SuccessModal onClose={() => setIsSuccessModalOpen(false)} />
                )
            }
        </div>
    );
}

export { Config };

