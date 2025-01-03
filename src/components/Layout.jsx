import { useState } from "react";
import { NavBar } from "./NavBar";
import { SideBarMenu } from "./SideBarMenu";
import BurguerMenuIcon from '@assets/burguerMenuIcon.svg?react';
import XIcon from '@assets/xIcon.svg?react';
import PropTypes from "prop-types";

function Layout({ children }) {

    //estado para saber cuando esta abierto el menu y poder aplicar el responsive
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <>
            <NavBar />
            <main className="flex h-[calc(100vh-64px)] w-full fixed">
                {/* Botón para abrir/cerrar el sidebar en tamaños pequeños */}
                <button
                    className="lg:hidden absolute top-4 left-4 z-50 bg-gray-100 p-2 rounded-lg shadow-md"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? <XIcon className="w-6 h-6" /> : <BurguerMenuIcon className="w-6 h-6" />}
                </button>

                {/* Sidebar */}
                <section
                    className={`bg-gray-100 lg:w-56 w-44 h-full pt-4 overflow-y-auto overflow-x-hidden custom-scrollbar transition-transform duration-300 z-40 fixed lg:relative ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                        } lg:translate-x-0`}
                >
                    <SideBarMenu />
                </section>

                {/* Contenido principal */}
                <section className={`bg-white mx-2 w-full h-auto flex flex-col overflow-auto custom-scrollbar ${isSidebarOpen ? "pl-[22%]" : ""} lg:pl-0`}>
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