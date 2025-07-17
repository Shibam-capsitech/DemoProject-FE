import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Breadcrumbs from "./BreadCrumb";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapse = () => setCollapsed((prev) => !prev);

    return (
        <div style={{ display: "flex", overflowY:"hidden" }}>
            <Sidebar collapsed={collapsed} toggleCollapse={toggleCollapse} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100%", overflowY:"hidden" }}>
                <Header />
                <Breadcrumbs/>
                <main
                    style={{
                        flex: 1,
                        padding: "15px",
                         overflowY:"hidden"
                    }}
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
