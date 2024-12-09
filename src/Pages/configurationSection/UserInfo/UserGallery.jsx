import { useState } from 'react';
import UpLoadIcon from '@assets/uploadIcon.svg?react';

function UserGallery() {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (selectedFile) {
            console.log('Archivo seleccionado:', selectedFile);
        }
    };

    return (
        <div className="p-4 w-full">
            <p className="text-lg font-semibold mb-2">
                Puedes cargar archivos relacionados a tu perfil.
            </p>

            <div className="border-dashed border-2 border-gray-300 p-6 rounded-lg text-gray-500 mb-4 text-center">
                <p>Arrastra archivos aquí o haz click en el botón "Seleccionar archivos"... </p>
            </div>

            <div className="flex items-center gap-4">
                <label htmlFor="file" className="cursor-pointer w-[75%] px-4 py-2  border rounded-lg text-gray-500 text-center">
                    <p>Click aquí para seleccionar un archivo</p>
                </label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full hidden"
                />

                <button
                    onClick={handleUpload}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center w-[25%]"
                >
                    <UpLoadIcon className="w-5 h-5 mr-2" />
                    SUBIR ARCHIVOS
                </button>
            </div>
        </div>
    )
}

export { UserGallery };