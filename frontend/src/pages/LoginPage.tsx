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
                toast.success('Login successful');
                nav('/main');
            })
            .catch((error) => {
                toast.error('Login failed: ' + error.response.data.message);
            });
    };
    const login = () => {
        if (!user.username || !user.password) {
            toast.error('Please fill in all fields');
            return;
        }
        tryLogin();
    };
    return (
        <>
            <div className="login-container">
                <p id="username">Username</p>
                <input
                    type="text"
                    id="usernameField"
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    placeholder="Your username"
                />
                <p id="password">Password</p>
                <input
                    type="password"
                    id="passwordField"
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    placeholder="Your password"
                />
                <button onClick={login} id="loginButton">
                    Login
                </button>
            </div>
            <div>
                <p>
                    You dont have an account yet? <Link to="/register">Register here</Link>
                </p>
            </div>
        </>
    );
}

export default LoginPage;
