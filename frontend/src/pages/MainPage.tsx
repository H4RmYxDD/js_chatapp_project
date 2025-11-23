// ...existing code...
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import type { Message } from '../types/Message';
import { apiClient } from '../api/apiClient';

const MainPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [usersMap, setUsersMap] = useState<Record<string, string>>({});
    const navigate = useNavigate();
    const currentUserId = Number(localStorage.getItem('userId')) || null;
    const [showTimestamps, setShowTimestamps] = useState<boolean>(() => {
        try {
            const v = localStorage.getItem('prefs_showTimestamps');
            return v == null ? true : v === '1';
        } catch (e) {
            return true;
        }
    });

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
        // also fetch users so we can map senderId -> username
        apiClient
            .get('/users')
            .then((res) => {
                if (canceled) return;
                const map: Record<string, string> = {};
                if (Array.isArray(res.data)) {
                    res.data.forEach((u: any) => {
                        if (u && typeof u.id !== 'undefined')
                            map[String(u.id)] = u.username || u.email || '';
                    });
                }
                setUsersMap(map);
            })
            .catch(() => {
                if (!canceled) setUsersMap({});
            });
        return () => {
            canceled = true;
        };
    }, []);

    useEffect(() => {
        // listen for preference changes (other tabs or preferences page)
        const handler = () => {
            try {
                const v = localStorage.getItem('prefs_showTimestamps');
                setShowTimestamps(v == null ? true : v === '1');
            } catch (e) {}
        };
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, []);

    const buildThreads = (msgs: Message[]) => {
        const children = new Map<string, Message[]>();
        const roots: Message[] = [];
        msgs.forEach((m) => {
            const pid = String(m.parentMsgId || '');
            if (pid === '' || pid === 'null' || pid === 'undefined') {
                roots.push(m);
            } else {
                if (!children.has(pid)) children.set(pid, []);
                children.get(pid)!.push(m);
            }
        });
        roots.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        children.forEach((arr) =>
            arr.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)),
        );
        return { roots, children };
    };

    const { roots, children } = buildThreads(messages);

    const ThreadCard: React.FC<{ msg: Message; level?: number }> = ({ msg, level = 0 }) => {
        const kids = children.get(String(msg.id)) || [];
        const senderKey = String(msg.senderId);
        const sender = usersMap[senderKey] || String(msg.senderId) || 'Unknown';
        const isSent = currentUserId && Number(msg.senderId) === currentUserId;
        return (
            <div className="thread-card" style={{ marginLeft: level * 14 }}>
                <div className="thread-meta">
                    <strong className="thread-sender">{sender}</strong>
                    {showTimestamps && (
                        <span className="thread-time">
                            {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}
                        </span>
                    )}
                </div>
                <div className="thread-content">{msg.content}</div>

                <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className="small" style={{ color: 'rgba(0,0,0,0.6)' }}>
                        {isSent ? 'Sent' : 'Received'}
                    </span>
                    <button
                        className="btn btn-sm"
                        onClick={() => navigate(`/messages/thread/${msg.id}`)}
                        aria-label={`Reply to message ${msg.id}`}
                        style={{ marginLeft: 'auto' }}
                    >
                        Reply
                    </button>
                </div>

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

    return (
        <main className="main-content">
            <div className="app-container">
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
    );
};

export default MainPage;
// ...existing code...
