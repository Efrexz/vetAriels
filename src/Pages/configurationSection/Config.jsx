
import { useContext } from 'react';
import { GlobalContext } from '@context/GlobalContext';
import { HorizontalMenu } from '@components/HorizontalMenu';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import EmailIcon from '@assets/emailIcon.svg?react';
import PhoneIcon from '@assets/phoneIcon.svg?react';
import HospitalIcon from '@assets/hospitalIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import LocationIcon from '@assets/locationIcon.svg?react';
import FacebookIcon from '@assets/facebook.svg?react';

function Config() {

    const { setThemeColor } = useContext(GlobalContext);

    const formFields = [
        {
            label: 'Nombre de la clínica',
            id: 'clinic_name',
            type: 'text',
            icon: HospitalIcon,
            required: true
        },
        {
            label: 'Correo electrónico de la clínica',
            id: 'email',
            type: 'text',
            icon: EmailIcon,
            required: true
        },
        {
            label: 'Departamento *',
            id: 'departamento',
            type: 'select',
            options: ['LIMA']
        },
        {
            label: 'Provincia *',
            id: 'provincia',
            type: 'select',
            options: ['LIMA']
        },
        {
            label: 'Distrito',
            id: 'distrito',
            type: 'select',
            options: ['LIMA']
        },
        {
            label: 'Dirección',
            id: 'direccion',
            type: 'text',
            icon: LocationIcon,
        },
        {
            label: 'Teléfono Fijo',
            id: 'telefono_fijo',
            type: 'text',
            icon: PhoneIcon,
            required: true
        },
        {
            label: 'Celular',
            id: 'celular',
            type: 'text',
            icon: PhoneIcon,
        },
        {
            label: 'Facebook',
            id: 'facebook',
            type: 'text',
            icon: FacebookIcon,
        },
    ];

    const themeColorList = [
        { color: 'blue', bgClass: 'bg-blue-400', hoverClass: 'hover:bg-blue-500' },
        { color: 'red', bgClass: 'bg-red-400', hoverClass: 'hover:bg-red-500' },
        { color: 'green', bgClass: 'bg-green-400', hoverClass: 'hover:bg-green-500' },
        { color: 'yellow', bgClass: 'bg-yellow-400', hoverClass: 'hover:bg-yellow-500' },
        { color: 'purple', bgClass: 'bg-purple-400', hoverClass: 'hover:bg-purple-500' },
        { color: 'gray', bgClass: 'bg-gray-400', hoverClass: 'hover:bg-gray-500' },
    ];

    return (
        <div className="container mx-auto p-6">

            <div className="flex justify-between items-center mb-6">
                <HorizontalMenu />
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

                                    {field.type === 'select' ? (
                                        <select
                                            id={field.id}
                                            className="border rounded-lg p-3 bg-gray-50 w-full hover:border-blue-300 focus-within:border-blue-300"
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
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3">
                    <PlusIcon className="w-5 h-5 text-white" />
                    ACTUALIZAR
                </button>
            </div>
        </div>
    );
}

export { Config };

