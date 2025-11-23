// ...existing code...
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Login.css';
import type { User } from '../types/User';
import { apiClient } from '../api/apiClient';

function RegisterPage() {
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [user, setUser] = useState<User>({
        username: '',
        email: '',
        password: '',
    });
    const nav = useNavigate();
    const register = () => {
        if (!user.email || !user.username || !user.password) {
            toast.error('Please fill in all fields');
            return;
        } else if (user.password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        } else if (!user.email.includes('@')) {
            toast.error('Please enter a valid email address');
            return;
        } else if (user.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        } else {
            tryRegister();
        }
    };
    const tryRegister = async () => {
        apiClient
            .post('/users/register', user)
            .then(() => {
                toast.success('Register successful');
                nav('/');
            })
            .catch((error) => {
                toast.error('Register failed: ' + (error.response?.data?.message || error.message));
            });
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        register();
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
                        <h2 style={{ margin: 0 }}>Join TalkBerry</h2>
                        <p className="small" style={{ marginTop: 8 }}>
                            Fast, simple threaded messaging
                        </p>
                    </div>
                </aside>

                <section className="login-right">
                    <h3 style={{ marginTop: 0 }}>Create an account</h3>
                    <form onSubmit={onSubmit} className="login-form" autoComplete="off">
                        <label>Email</label>
                        <input
                            name="email"
                            className="form-input"
                            required
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            placeholder="you@example.com"
                        />

                        <label>Username</label>
                        <input
                            name="username"
                            className="form-input"
                            required
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            placeholder="Choose a username"
                        />

                        <label>Password</label>
                        <input
                            name="password"
                            type="password"
                            className="form-input"
                            required
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            placeholder="At least 6 characters"
                        />

                        <label>Confirm Password</label>
                        <input
                            name="confirm"
                            type="password"
                            className="form-input"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat your password"
                        />

                        <div style={{ height: 8 }} />
                        <button type="submit" className="btn btn-primary">
                            Register
                        </button>
                        <div style={{ height: 8 }} />
                        <div className="small">
                            Already have an account? <Link to="/">Login</Link>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default RegisterPage;
