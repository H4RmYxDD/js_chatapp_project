import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { apiClient } from '../api/apiClient';
import '../pages/MainPage.css';

const SIDEBAR_WIDTH = 240;

const GlobalSidebar: React.FC = () => {
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
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
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

            {open && (
                <div className="overlay" onClick={close} style={{ left: `${SIDEBAR_WIDTH}px` }} />
            )}
        </>
    );

    const sidebarEl = (
        <Sidebar
            className={`sidebar pro-sidebar ${open ? 'open' : ''}`}
            aria-hidden={!open}
            style={{ width: SIDEBAR_WIDTH }}
        >
            <div className="sidebar-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={logo} alt="TalkBerry" className="sidebar-logo" />
                    <span className="sidebar-brand">TalkBerry</span>
                </div>
                <button className="close-btn" onClick={close} aria-label="Close menu">
                    ×
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Menu>
                    <MenuItem component={<Link to="/main" onClick={close} />}>Home</MenuItem>
                    <MenuItem component={<Link to="/users" onClick={close} />}>Users</MenuItem>

                    <SubMenu label="Settings" title="Dropdown" className="sidebar-submenu">
                        <MenuItem component={<Link to="/settings/profile" onClick={close} />}>
                            Profile
                        </MenuItem>
                        <MenuItem component={<Link to="/settings/preferences" onClick={close} />}>
                            Preferences
                        </MenuItem>
                    </SubMenu>
                </Menu>

                <div className="logout-area" role="group" aria-label="Logout">
                    <button className="logout-button" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        </Sidebar>
    );

    return (
        <>
            {mounted && createPortal(floating, document.body)}
            {mounted && createPortal(sidebarEl, document.body)}
        </>
    );
};

export default GlobalSidebar;
