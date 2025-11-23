import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import './MainPage.css';

const SIDEBAR_WIDTH = 240;

const MainPage: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!mounted) return;
        document.body.classList.toggle('sidebar-open', open);
        return () => document.body.classList.remove('sidebar-open');
    }, [open, mounted]);

    const toggle = () => setOpen((v) => !v);
    const close = () => setOpen(false);
    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    const floating = (
        <>
            <button
                className={`menu-button ${open ? 'hidden' : ''}`}
                aria-label="Open sidebar"
                aria-expanded={open}
                onClick={toggle}
            >
                …
            </button>

            {open && <div className="overlay" onClick={close} style={{ left: `${SIDEBAR_WIDTH}px` }} />}
        </>
    );

    const sidebarEl = (
        <Sidebar className={`sidebar pro-sidebar ${open ? 'open' : ''}`} aria-hidden={!open} style={{ width: SIDEBAR_WIDTH }}>
            <div className="sidebar-header">
                <span>React-Pro-Sidebar</span>
                <button className="close-btn" onClick={close} aria-label="Close menu">×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Menu>
                    <MenuItem component={<Link to="/" onClick={close} />}>Home</MenuItem>
                    <MenuItem component={<Link to="/link" onClick={close} />}>Link</MenuItem>

                    <SubMenu label="Dropdown" title="Dropdown" className="sidebar-submenu">
                        <MenuItem component={<Link to="/a" onClick={close} />}>Action</MenuItem>
                        <MenuItem component={<Link to="/b" onClick={close} />}>Another action</MenuItem>
                        <MenuItem component={<Link to="/c" onClick={close} />}>Something</MenuItem>
                    </SubMenu>
                </Menu>

                <div className="logout-area" role="group" aria-label="Logout">
                    <button className="logout-button" onClick={logout}>Logout</button>
                </div>
            </div>
        </Sidebar>
    );

    return (
        <>
            {mounted && createPortal(floating, document.body)}
            {mounted && createPortal(sidebarEl, document.body)}

            <main className="main-content">
                <div style={{ padding: 24 }}>
                    <h1>nyald meg a herem</h1>
                </div>
            </main>
        </>
    );
};

export default MainPage;