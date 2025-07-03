import { useContext } from "react";
import { NavBar } from "@components/layout/NavBar";
import { SideBarMenu } from "./SideBarMenu";
import { GlobalContext } from "@context/GlobalContext";
import BurguerMenuIcon from '@assets/burguerMenuIcon.svg?react';
import XIcon from '@assets/xIcon.svg?react';
import PropTypes from "prop-types";

function Layout({ children }) {
    const { isSidebarOpen, toggleSideMenu } = useContext(GlobalContext);

    return (
        <>
            <NavBar />
            <main className="flex h-[calc(100vh-62px)] w-full fixed">
                {/* Botón para abrir/cerrar el sidebar en tamaños pequeños */}
                <button
                    className="lg:hidden absolute top-4 left-4 z-50 bg-gray-100 p-2 rounded-lg shadow-md"
                    onClick={toggleSideMenu}
                >
                    {isSidebarOpen ? <XIcon className="w-6 h-6" /> : <BurguerMenuIcon className="w-6 h-6" />}
                </button>

                {/* Sidebar */}
                <section
                    className={`bg-gray-100 md:w-56 w-full h-full pt-4 overflow-y-auto overflow-x-hidden custom-scrollbar transition-transform duration-300 z-40 absolute  lg:relative ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } lg:translate-x-0`}
                >
                    <SideBarMenu toggleSideMenu={toggleSideMenu} />
                </section>

                {/* Contenido principal */}
                <section className={`bg-white mx-2 w-full h-auto flex flex-col overflow-auto custom-scrollbar  lg:pl-0 mb-14 md:mb-4`}>
                    {children}
                </section>
            </main>
        </>
    );
}

export { Layout }

Layout.propTypes = {
    children: PropTypes.node
}