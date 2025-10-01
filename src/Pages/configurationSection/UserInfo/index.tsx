import { useParams } from "react-router-dom";
import { HorizontalMenu } from '@components/ui/HorizontalMenu';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import { UserProfile } from './UserProfile';
import { UserPassword } from './UserPassword';
import { UserGallery } from './UserGallery';

function UserInfo() {

    const { section } = useParams();

    return (
        <div className="w-full p-1 md:p-6 bg-gray-950">
            <div className="flex items-center mb-4 border-b border-cyan-500 pb-4 px-4">
                <h1 className="text-xl md:text-2xl font-medium flex items-center" >
                    <RoleUserIcon className="w-8 h-8 sm:w-9 sm:h-9 mr-3 text-cyan-400 drop-shadow-lg" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">Perfil</span>
                </h1>
            </div>
            <HorizontalMenu mode="user" />

            <div className="flex flex-col md:flex-row bg-gray-900 shadow-xl rounded-t-lg overflow-hidden mt-6">
                <div className="w-full md:w-1/4 p-6 bg-gray-800 flex flex-col items-center">
                    <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <RoleUserIcon className="w-16 h-16 text-gray-400" />
                    </div>
                </div>
                {section === 'update' && <UserProfile />}
                {section === 'password' && <UserPassword />}
                {section === 'gallery' && <UserGallery />}
            </div>
        </div>
    );
}

export { UserInfo };