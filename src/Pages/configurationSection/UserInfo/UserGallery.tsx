import { useState , ChangeEvent } from 'react';
import UpLoadIcon from '@assets/uploadIcon.svg?react';

function UserGallery() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        // event.target.files es un objeto FileList, no un array.
        // Nos aseguramos de que no sea nulo y que contenga al menos un archivo.
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            console.log('Archivo seleccionado:', selectedFile);
        }
    };

    return (
        <div className="p-4 w-full">
            <p className="text-lg font-semibold mb-2 text-gray-200">
                Puedes cargar archivos relacionados a tu perfil.
            </p>

            <div className="bg-gray-800 border-dashed border-2 border-gray-600 p-6 rounded-lg text-gray-400 mb-4 text-center">
                <p>Arrastra archivos aquí o haz click para seleccionar...</p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
                {/* --- Paso 4: Mejora de Accesibilidad --- */}
                {/* La 'label' ahora está correctamente asociada al 'input' mediante id y htmlFor */}
                <label htmlFor="file-upload" className="cursor-pointer w-full md:w-[75%] px-4 py-2 border border-gray-700 bg-gray-800 rounded-lg text-gray-400 text-center hover:border-cyan-500 transition-colors">
                    {/* --- Paso 3: Mejora de UX - Mostrar archivo seleccionado --- */}
                    {selectedFile ? (
                        <p className="text-emerald-500 font-semibold truncate">
                            Archivo: {selectedFile.name}
                        </p>
                    ) : (
                        <p>Click aquí para seleccionar un archivo</p>
                    )}
                </label>
                <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden" // El input sigue oculto, la label actúa como su interfaz
                />

                <button
                    onClick={handleUpload}
                    disabled={!selectedFile} // --- Paso 3: Mejora de UX - Deshabilitar si no hay archivo ---
                    className="bg-emerald-600  w-full md:w-auto hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <UpLoadIcon className="w-5 h-5 mr-2" />
                    SUBIR ARCHIVO
                </button>
            </div>
        </div>
    );
}

export { UserGallery };