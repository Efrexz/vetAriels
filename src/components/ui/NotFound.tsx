import { Link } from 'react-router-dom';
import AlertIcon from '@assets/alertIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';

interface NotFoundProps {
    entityName: string;
    searchId: string;
    returnPath: string;
}

function NotFound({ entityName, searchId, returnPath }: NotFoundProps) {
    return (
        <main className="container mx-auto p-8 flex items-center justify-center min-h-[calc(100vh-100px)] bg-gray-950">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-12 max-w-xl w-full text-center border-t-4 border-cyan-500">
                <AlertIcon className="text-cyan-500 w-16 mx-auto mb-6 opacity-80" />
                <h1 className="text-4xl font-extrabold text-gray-200 mb-4">
                    {entityName} no Encontrado
                </h1>
                <p className="text-lg text-gray-400 mb-6 leading-relaxed">
                    No se encontró ningún {entityName.toLowerCase()} con el ID "<strong className="text-emerald-400">{searchId}</strong>".
                    Por favor, verifica el identificador.
                </p>
                <div className="border-t border-gray-700 pt-6 mt-6">
                    <Link
                        to={returnPath}
                        className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:from-cyan-500 hover:to-emerald-500 transition duration-300 ease-in-out text-lg"
                    >
                        <SearchIcon className="w-5 mr-3" /> Ver lista de {entityName.toLowerCase()}s
                    </Link>
                </div>
            </div>
        </main>
    );
}

export { NotFound };