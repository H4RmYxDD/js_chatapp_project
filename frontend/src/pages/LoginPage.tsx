// ...existing code...
import { useState } from 'react';
import { toast } from 'react-toastify';
import { apiClient } from '../api/apiClient';
import type { User } from '../types/User';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function LoginPage() {
    const [user, setUser] = useState<User>({
        username: '',
        password: '',
    });
    const nav = useNavigate();
    const tryLogin = async () => {
        apiClient
            .post('/users/login', user)
            .then((res) => {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem("userId", res.data.user.id);
                toast.success('Login successful');
                nav('/main');
            })
            .catch((error) => {
                toast.error('Login failed: ' + error.response?.data?.message || error.message);
            });
    };
    const login = () => {
        if (!user.username || !user.password) {
            toast.error('Please fill in all fields');
            return;
        }
        tryLogin();
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login();
    };

    return (
        <>
            <form className="login-container" onSubmit={onSubmit}>
                <label htmlFor="usernameField">Username</label>
                <input
                    type="text"
                    id="usernameField"
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    placeholder="Your username"
                    value={user.username}
                />
                <label htmlFor="passwordField">Password</label>
                <input
                    type="password"
                    id="passwordField"
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    placeholder="Your password"
                    value={user.password}
                />
                <button type="submit" id="loginButton">
                    Login
                </button>
            </form>

            <div>
                <p>
                    You dont have an account yet? <Link to="/register">Register here</Link>
                </p>
            </div>
        </>
    );
}

export default LoginPage;
