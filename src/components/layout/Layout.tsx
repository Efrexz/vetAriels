import { ReactNode, useEffect } from "react";
import { NavBar } from "@components/layout/NavBar";
import { SideBarMenu } from "./SideBarMenu";
import { useGlobal } from "@context/GlobalContext";
import { applyThemeColor } from "@utils/theme.utils";

interface LayoutProps {
    children: ReactNode;
}

function Layout({ children }: LayoutProps) {
    const { isSidebarOpen, toggleSideMenu, themeColor } = useGlobal();

    useEffect(() => {
        applyThemeColor(themeColor);
    }, [themeColor]);

    return (
        <div className="flex h-screen w-full bg-mist text-ink overflow-hidden">
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/30 z-30"
                    onClick={toggleSideMenu}
                />
            )}

            <aside
                className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-paper border-r border-slate-200 flex flex-col transition-transform duration-300 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}
            >
                <SideBarMenu toggleSideMenu={toggleSideMenu} />
            </aside>

            <div className="flex-1 flex flex-col min-w-0 h-screen">
                <NavBar />
                <div className="flex-1 overflow-auto custom-scrollbar">
                    <div className="p-4 sm:p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Layout }
