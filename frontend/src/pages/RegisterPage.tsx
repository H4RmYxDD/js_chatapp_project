// ...existing code...
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Register.css';
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
        <>
            <form className="register-container" onSubmit={onSubmit}>
                <p id="email">Email</p>
                <input
                    type="text"
                    id="emailField"
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    placeholder="Your email"
                    value={user.email}
                />
                <p id="username">Username</p>
                <input
                    type="text"
                    id="usernameField"
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    placeholder="Your username"
                    value={user.username}
                />
                <p id="password">Password</p>
                <input
                    type="password"
                    id="passwordField"
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    placeholder="Your password"
                    value={user.password}
                />
                <p id="password-confirm">Confirm Password</p>
                <input
                    type="password"
                    id="passwordConfirmField"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                />
                <button id="registerButton" type="submit">
                    Register
                </button>
            </form>
            <div>
                <p>
                    Already have an account? <Link to="/">Login here</Link>
                </p>
            </div>
        </>
    );
}

export default RegisterPage;
