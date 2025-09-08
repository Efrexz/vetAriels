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
        <main className="container mx-auto p-8 flex items-center justify-center min-h-[calc(100vh-100px)]">
            <div className="bg-white rounded-xl shadow-lg p-12 max-w-xl w-full text-center border-t-4 border-blue-500">
                <AlertIcon className="text-blue-500 w-16 mx-auto mb-6 opacity-80" />
                <h1 className="text-4xl font-extrabold text-gray-700 mb-4">
                {entityName} no Encontrado
                </h1>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                No se encontró ningún {entityName.toLowerCase()} con el ID "<strong className="text-blue-600">{searchId}</strong>".
                Por favor, verifica el identificador.
                </p>
                <div className="border-t border-gray-200 pt-6 mt-6">
                    <Link
                        to={returnPath}
                        className="inline-flex items-center px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out text-lg"
                    >
                        <SearchIcon className="w-5 mr-3" /> Ver lista de {entityName.toLowerCase()}s
                    </Link>
                </div>
            </div>
        </main>
    );
}

export { NotFound };