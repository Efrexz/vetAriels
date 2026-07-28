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
        <div className="p-5 w-full">
            <p className="text-sm font-medium text-ink mb-3">
                Puedes cargar archivos relacionados a tu perfil.
            </p>

            <div className="bg-slate-50/50 border-dashed border-2 border-slate-200 p-6 rounded-xl text-slate mb-4 text-center text-sm">
                <p>Arrastra archivos aqu&iacute; o haz click para seleccionar...</p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
                <label htmlFor="file-upload" className="cursor-pointer w-full md:w-[75%] px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-slate text-sm text-center hover:border-primary transition-colors">
                    {selectedFile ? (
                        <p className="text-success font-semibold truncate">
                            Archivo: {selectedFile.name}
                        </p>
                    ) : (
                        <p>Click aqu&iacute; para seleccionar un archivo</p>
                    )}
                </label>
                <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                />

                <button
                    onClick={handleUpload}
                    disabled={!selectedFile}
                    className="bg-primary w-full md:w-auto hover:opacity-90 text-white font-semibold py-2 px-5 rounded-xl flex items-center justify-center transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm font-display shadow-sm shadow-primary/25"
                >
                    <UpLoadIcon className="w-4 h-4 mr-2" />
                    Subir archivo
                </button>
            </div>
        </div>
    );
}

export { UserGallery };