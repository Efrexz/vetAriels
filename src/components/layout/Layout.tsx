import { ReactNode } from "react";
import { NavBar } from "@components/layout/NavBar";
import { SideBarMenu } from "./SideBarMenu";
import { useGlobal } from "@context/GlobalContext";
import BurguerMenuIcon from '@assets/burguerMenuIcon.svg?react';
import XIcon from '@assets/xIcon.svg?react';

interface LayoutProps {
    children: ReactNode;
}


function Layout({ children }: LayoutProps) {
    const { isSidebarOpen, toggleSideMenu } = useGlobal();

    return (
        <>
            <NavBar />
            <main className="flex h-screen w-full bg-gray-950 text-gray-50">
                {/* Sidebar */}
                <aside
                    className={`bg-gray-900 w-64 h-full pt-4 overflow-y-auto overflow-x-hidden custom-scrollbar transition-transform duration-300 z-40 fixed lg:relative ${
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0`}
                >
                    <button
                        className="lg:hidden absolute top-4 left-[210px] z-50 p-2 rounded-lg text-cyan-400"
                        onClick={toggleSideMenu}
                    >
                        {isSidebarOpen ? <XIcon className="w-6 h-6" /> : null}
                    </button>
                    <SideBarMenu toggleSideMenu={toggleSideMenu} />
                </aside>

                <section className="flex-1 flex flex-col overflow-auto custom-scrollbar pt-16 lg:pt-0">
                    <div className="flex-1 p-4 sm:p-6">
                        {children}
                    </div>
                </section>
            </main>
        </>
    );
}

export { Layout }