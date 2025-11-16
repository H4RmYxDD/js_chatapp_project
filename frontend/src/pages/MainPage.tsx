import { useState } from 'react';
import { Sidebar, Menu, MenuItem, sidebarClasses } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import './MainPage.css';

const MainPage = () => {
    const [open, setOpen] = useState(false);
    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };
    return (
        <>
            <button
                aria-label="Open sidebar"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="menu-button"
            >
                …
            </button>

            {open && (
                <div
                    onClick={() => setOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.35)',
                        zIndex: 1000,
                    }}
                />
            )}

            <Sidebar
                rootStyles={{
                    [`.${sidebarClasses.container}`]: {
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        height: '100vh',
                        width: 240,
                        transform: open ? 'translateX(0)' : 'translateX(-100%)',
                        transition: 'transform 220ms ease',
                        zIndex: 1100,
                        backgroundColor: '#13395e',
                        color: '#b6c8d9',
                        boxShadow: '2px 0 8px rgba(0,0,0,0.12)',
                        display: 'flex',
                        flexDirection: 'column',
                    },
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Menu
                        menuItemStyles={{
                            button: {
                                [`&.active`]: {
                                    backgroundColor: '#0f2b44',
                                    color: '#fff',
                                },
                            },
                        }}
                    >
                        <MenuItem component={<Link to="/documentation" />}> Documentation</MenuItem>
                        <MenuItem component={<Link to="/calendar" />}> Calendar</MenuItem>
                        <MenuItem component={<Link to="/e-commerce" />}> E-commerce</MenuItem>
                    </Menu>

                    <div style={{ marginTop: 'auto' }}>
                        <Menu>
                            <MenuItem className="menu-item-logout" onClick={logout}>
                                Logout
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            </Sidebar>

            <div style={{ padding: 24, marginLeft: 0 }}>
                <h1>nyald meg a herem</h1>
            </div>
        </>
    );
};

export default MainPage;
