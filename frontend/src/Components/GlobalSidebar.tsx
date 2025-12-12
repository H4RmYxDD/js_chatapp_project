import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

const SIDEBAR_WIDTH = 260;

const GlobalSidebar: React.FC = () => {
    const [open, setOpen] = useState(false);

    const toggle = () => setOpen((v) => !v);
    const close = () => setOpen(false);

    const logout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    return (
        <div className={open ? 'sidebar-open' : 'sidebar-closed'}>
            {}
            <button
                onClick={toggle}
                style={{
                    position: 'fixed',
                    top: 20,
                    left: open ? `${SIDEBAR_WIDTH + 16}px` : '20px',
                    zIndex: 1001,
                    background: '#7b61ff',
                    color: 'white',
                    border: 'none',
                    width: 52,
                    height: 52,
                    borderRadius: '16px',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(123,97,255,0.4)',
                    transition: 'all 0.3s ease',
                }}
                aria-label="Toggle menu"
            >
                {open ? '×' : '...'}
            </button>

            {}
            <Sidebar
                collapsed={!open}
                collapsedWidth="0px"
                width={`${SIDEBAR_WIDTH}px`}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    zIndex: 1000,
                    transition: 'transform 0.3s cubic-bezier(.4,0,.2,1)',
                    transform: open ? 'translateX(0)' : 'translateX(-100%)',
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                }}
            >
                <div
                    style={{
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'linear-gradient(180deg, #0f1e36 0%, #0b1426 100%)',
                        overflow: 'hidden',
                    }}
                >
                    {}
                    <div
                        style={{
                            padding: '20px 16px',
                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <img
                                src={logo}
                                alt="TalkBerry"
                                style={{ width: 46, borderRadius: 10 }}
                            />
                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#bb86fc' }}>
                                TalkBerry
                            </span>
                        </div>
                    </div>

                    {}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
                        <Menu
                            menuItemStyles={{
                                button: ({ active }) => ({
                                    'backgroundColor': active
                                        ? 'rgba(123,97,255,0.2)'
                                        : 'transparent',
                                    'color': active ? '#fff' : '#e0e0ff',
                                    'fontWeight': active ? 600 : 400,
                                    '&:hover': {
                                        backgroundColor: 'rgba(123,97,255,0.15)',
                                        color: '#fff',
                                    },
                                }),
                            }}
                        >
                            <MenuItem component={<Link to="/main" onClick={close} />}>
                                Home
                            </MenuItem>
                            <MenuItem component={<Link to="/users" onClick={close} />}>
                                Users
                            </MenuItem>

                            <SubMenu label="Settings">
                                <MenuItem
                                    component={<Link to="/settings/profile" onClick={close} />}
                                >
                                    Profile
                                </MenuItem>
                                <MenuItem
                                    component={<Link to="/settings/preferences" onClick={close} />}
                                >
                                    Preferences
                                </MenuItem>
                            </SubMenu>
                        </Menu>
                    </div>

                    {}
                    <div style={{ padding: '16px' }}>
                        <button
                            onClick={logout}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: 'rgba(239, 68, 68, 0.2)',
                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                borderRadius: '12px',
                                color: '#fca5a5',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </Sidebar>

            {}
            {open && (
                <div
                    onClick={close}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.75)',
                        zIndex: 999,
                    }}
                />
            )}
        </div>
    );
};

export default GlobalSidebar;
