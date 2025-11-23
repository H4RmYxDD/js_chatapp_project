import React from 'react';
import logo from '../assets/logo.png';
import './AppLayout.css';
import GlobalSidebar from './GlobalSidebar';

const AppLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    return (
        <div>
            <GlobalSidebar />
            <header className="app-header">
                <div className="app-container" style={{ minHeight: 12 }} />
            </header>

            <main style={{ paddingTop: 20 }}>
                <div className="app-container">{children}</div>
            </main>
        </div>
    );
};

export default AppLayout;
