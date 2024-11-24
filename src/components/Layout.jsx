import { NavBar } from "./NavBar";
import { SideBarMenu } from "./SideBarMenu";
import PropTypes from "prop-types";

function Layout({ children }) {
    return (
        <>
            <NavBar />
            <main className="flex h-[calc(100vh-64px)] w-full fixed">
                <section className="bg-gray-100 pl-6 w-[16%] h-full pt-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    <SideBarMenu />
                </section>
                <section className="bg-white mx-2 w-full h-auto flex flex-col overflow-auto custom-scrollbar ">
                    {children}
                </section>
            </main>
        </>
    )
}

export { Layout }

Layout.propTypes = {
    children: PropTypes.node
}