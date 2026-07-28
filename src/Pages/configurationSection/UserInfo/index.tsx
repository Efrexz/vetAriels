import { useParams } from "react-router-dom";
import { HorizontalMenu } from '@components/ui/HorizontalMenu';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import { UserProfile } from './UserProfile';
import { UserPassword } from './UserPassword';
import { UserGallery } from './UserGallery';

function UserInfo() {

    const { section } = useParams();

    return (
        <div className="w-full">
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
                    Mi cuenta
                </span>
                <h1 className="text-2xl font-bold font-display text-ink">
                    Perfil
                </h1>
            </div>
            <div className="mb-5">
                <HorizontalMenu mode="user" />
            </div>

            <div className="flex flex-col md:flex-row bg-paper shadow-sm rounded-2xl overflow-hidden border border-slate-200">
                <div className="w-full md:w-1/4 p-6 bg-slate-50/50 flex flex-col items-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mb-3">
                        <RoleUserIcon className="w-12 h-12 text-primary" />
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