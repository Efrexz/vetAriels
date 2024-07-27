import { NavBar } from "./NavBar";
import { SideBarMenu } from "./SideBarMenu";

function Layout({ children }) {
    return (
        <>
            <NavBar />
            <main className="flex h-[calc(100vh-72.8px)] w-full ">
                <section className="bg-gray-100 pl-6 w-[16%] h-full pt-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    <SideBarMenu />
                </section>
                <section className="bg-white p-4 w-full h-auto flex flex-col">
                    {children}
                </section>
            </main>
        </>
    )
}

export { Layout }