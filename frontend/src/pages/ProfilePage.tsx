import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        apiClient
            .get('/users/profile')
            .then((res) => {
                setUsername(res.data.username || '');
                setEmail(res.data.email || '');
            })
            .catch((err) => {
                toast.error('Failed to load profile');
                if (err.response?.status === 401) navigate('/');
            });
    }, [navigate]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updates: any = { username, email };
            if (password) updates.password = password;
            await apiClient.patch('/users/profile', updates);
            toast.success('Profile updated');
            setPassword('');
        } catch (err: any) {
            toast.error('Update failed: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <main className="main-content">
            <div className="app-container">
                <h2>Profile</h2>
                <form onSubmit={handleSave} style={{ maxWidth: 540 }}>
                    <label style={{ display: 'block', marginTop: 12 }}>Username</label>
                    <input
                        className="form-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ border: '1px solid purple' , color: 'pink'}}
                    />

                    <label style={{ display: 'block', marginTop: 12 }}>Email</label>
                    <input
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ border: '1px solid purple', color: 'pink' }}
                    />

                    <label style={{ display: 'block', marginTop: 12 }}>
                        New password (optional)
                    </label>
                    <input
                        type="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ border: '1px solid purple', color: 'pink' }}
                    />

                    <div style={{ height: 12 }} />
                    <button type="submit" className="btn btn-primary">
                        Save
                    </button>
                </form>
            </div>
        </main>
    );
};

export default ProfilePage;
