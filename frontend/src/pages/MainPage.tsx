// ...existing code...
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import './MainPage.css';
import type { Message } from '../types/Message';
import { apiClient } from '../api/apiClient';

const SIDEBAR_WIDTH = 240;

const MainPage: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!mounted) return;
        document.body.classList.toggle('sidebar-open', open);
        return () => document.body.classList.remove('sidebar-open');
    }, [open, mounted]);

    useEffect(() => {
        let canceled = false;
        setLoading(true);
        apiClient
            .get('/messages')
            .then((res) => {
                if (canceled) return;
                setMessages(Array.isArray(res.data) ? res.data : []);
            })
            .catch(() => {
                if (!canceled) setMessages([]);
            })
            .finally(() => {
                if (!canceled) setLoading(false);
            });
        return () => {
            canceled = true;
        };
    }, [mounted]);

    const toggle = () => setOpen((v) => !v);
    const close = () => setOpen(false);
    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    // build parent->children map and root threads
    const buildThreads = (msgs: Message[]) => {
        const children = new Map<string, Message[]>();
        const roots: Message[] = [];
        msgs.forEach((m) => {
            const pid = m.parentMsgId || '';
            if (!pid) {
                roots.push(m);
            } else {
                if (!children.has(pid)) children.set(pid, []);
                children.get(pid)!.push(m);
            }
        });
        // optional: sort roots by createdAt desc
        roots.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        // sort children arrays by createdAt asc (replies in order)
        children.forEach((arr, _) => arr.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)));
        return { roots, children };
    };

    const { roots, children } = buildThreads(messages);

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

    const ThreadCard: React.FC<{ msg: Message; level?: number }> = ({ msg, level = 0 }) => {
        const kids = children.get(msg.parentMsgId) || [];
        return (
            <div className="thread-card" style={{ marginLeft: level * 14 }}>
                <div className="thread-meta">
                    <strong className="thread-sender">{msg.senderId || 'Unknown'}</strong>
                    <span className="thread-time">{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}</span>
                </div>
                <div className="thread-content">{msg.content}</div>

                {kids.length > 0 && (
                    <div className="thread-children">
                        {kids.map((c) => (
                            <ThreadCard key={c.id} msg={c} level={level + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const sidebarEl = (
        <Sidebar
            className={`sidebar pro-sidebar ${open ? 'open' : ''}`}
            aria-hidden={!open}
            style={{ width: SIDEBAR_WIDTH }}
        >
            <div className="sidebar-header">
                <span>TalkBerry</span>
                <button className="close-btn" onClick={close} aria-label="Close menu">
                    ×
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Menu>
                    <MenuItem component={<Link to="/main" onClick={close} />}>Home</MenuItem>
                    <MenuItem component={<Link to="/users" onClick={close} />}>
                        Users
                    </MenuItem>

                    <SubMenu label="Settings" title="Dropdown" className="sidebar-submenu">
                        <MenuItem component={<Link to="/a" onClick={close} />}>Profile</MenuItem>
                        <MenuItem component={<Link to="/b" onClick={close} />}>Privacy</MenuItem>
                        <MenuItem component={<Link to="/c" onClick={close} />}>Preferences</MenuItem>
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

            <main className="main-content">
                <div style={{ padding: 24, width: '100%' }}>
                    <h1>News feed</h1>

                    {loading ? (
                        <div>Loading messages…</div>
                    ) : roots.length === 0 ? (
                        <div>No messages yet.</div>
                    ) : (
                        <section className="threads-list" aria-live="polite">
                            {roots.map((r) => (
                                <ThreadCard key={r.id} msg={r} />
                            ))}
                        </section>
                    )}
                </div>
            </main>
        </>
    );
};

export default MainPage;