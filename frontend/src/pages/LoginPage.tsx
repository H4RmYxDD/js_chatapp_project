import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { apiClient } from '../api/apiClient';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await apiClient.post('/users/login', {
            username: (e.target as any).username.value,
            password: (e.target as any).password.value,
        });
        localStorage.setItem('token', res.data.token);
        if (res.data.user) {
            try {
                localStorage.setItem('userId', String(res.data.user.id));
                localStorage.setItem('username', String(res.data.user.username));
            } catch (err) {}
        }
        navigate('/main');
    };

    return (
        <div className="login-wrapper center">
            <div className="login-card card">
                <aside className="login-left center">
                    <div>
                        <img
                            src="/src/assets/logo.png"
                            alt="TalkBerry"
                            style={{ width: 120, marginBottom: 16 }}
                        />
                        <h2 style={{ margin: 0 }}>Sweet conversations</h2>
                        <p className="small" style={{ marginTop: 8 }}>
                            Fast, simple threaded messaging
                        </p>
                    </div>
                </aside>

                <section className="login-right">
                    <h3 style={{ marginTop: 0 }}>Welcome back</h3>
                    <form onSubmit={submit} className="login-form" autoComplete="off">
                        <label>Username</label>
                        <input name="username" className="form-input" required />
                        <label style={{ marginTop: 12 }}>Password</label>
                        <input name="password" type="password" className="form-input" required />
                        <div style={{ height: 8 }} />
                        <button type="submit" className="btn btn-primary">
                            Sign in
                        </button>
                        <div style={{ height: 8 }} />
                        <div className="small">
                            Don't have an account? <a href="/register">Register</a>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default LoginPage;
