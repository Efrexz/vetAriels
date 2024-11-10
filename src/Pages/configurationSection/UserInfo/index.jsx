import { useContext } from 'react';
import { Link, useParams } from "react-router-dom";
import { HorizontalMenu } from '../../../components/HorizontalMenu';
import RoleUserIcon from '../../../assets/roleUserIcon.svg?react';
import { UserProfile } from './UserProfile';
import { UserPassword } from './UserPassword';
import { UserGallery } from './UserGallery';

function UserInfo() {

    const { id, section } = useParams();

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-5">
                <h1 className="text-2xl font-semibold flex items-center text-blue-400" >
                    <RoleUserIcon className="w-8 h-8 mr-2" />
                    Perfil
                </h1>
                <HorizontalMenu mode="user" />
            </div>

            <div className="flex md:flex-row bg-white shadow-lg rounded-t-lg overflow-hidden">
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