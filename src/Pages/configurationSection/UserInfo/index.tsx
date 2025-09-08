import { useParams } from "react-router-dom";
import { HorizontalMenu } from '@components/ui/HorizontalMenu';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import { UserProfile } from './UserProfile';
import { UserPassword } from './UserPassword';
import { UserGallery } from './UserGallery';

function UserInfo() {

    const { section } = useParams();

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center mb-6 border-b-2 border-gray-100 pb-5 px-4">
                <h1 className="text-xl md:text-2xl font-bold flex items-center text-blue-400" >
                    <RoleUserIcon className="w-6 sm:w-9 h-6 sm:h-9 mr-2" />
                    Perfil
                </h1>
            </div>
            <div className="mb-6 border-b-2 border-gray-100 pb-5">
                <HorizontalMenu mode="user" />
            </div>

            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-t-lg overflow-hidden">
                <div className="w-full md:w-1/4 p-6 bg-gray-100 flex flex-col items-center">
                    <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                        <RoleUserIcon className="w-16 h-16 text-gray-500" />
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