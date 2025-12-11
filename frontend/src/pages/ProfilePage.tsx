import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await apiClient.get('/users/profile');
                setUsername(res.data.user.username);
                setEmail(res.data.user.email);

                if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
                }
            } catch (err: any) {
                toast.error('Failed to load profile');
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/');
                }
            }
        };

        loadProfile();
    }, [navigate]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updates: any = {};

            if (username) updates.username = username.trim();
            if (email) updates.email = email.trim();
            if (password) {
                if (!currentPassword) {
                    toast.error('Current password is required to set a new password');
                    setLoading(false);
                    return;
                }
                updates.password = password;
                updates.currentPassword = currentPassword;
            }

            const res = await apiClient.patch('/users/profile', updates);

            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
            }

            setUsername(res.data.user.username);
            setEmail(res.data.user.email);

            toast.success('Profile updated successfully!');
            setPassword('');
            setCurrentPassword('');
        } catch (err: any) {
            const message = err.response?.data?.message || 'Update failed';
            toast.error(message);

            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="main-content">
            <div className="app-container">
                <h2>Profile Settings</h2>

                <form onSubmit={handleSave} style={{ maxWidth: 540 }}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            minLength={3}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>New Password (leave blank to keep current)</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Only if you want to change it"
                            autoComplete="new-password"
                        />
                    </div>

                    {password && (
                        <div className="form-group">
                            <label>Current Password (required to change password)</label>
                            <input
                                type="password"
                                className="form-input"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default ProfilePage;
