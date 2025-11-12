import { useState } from "react";
import { toast } from "react-toastify";
import { apiClient } from "../api/apiClient";
import type { User } from "../types/User";
import { Link } from "react-router-dom";
import './Login.css'

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const user: User = {
        username,
        password
    }
    const tryLogin = async () => {
        apiClient.post('/users/login', user)
        .then(() => {
            toast.success("Login successful");
        })
        .catch((error) => {
            toast.error("Login failed: " + error.response.data.message);
        });
    }
    const login = () => {
        if (!username || !password) {
            toast.error('Please fill in all fields');
            return;
        }
        tryLogin();
    }
    return<><div className="login-container">
        <p id='username'>Username</p>
        <input type="text" id="usernameField" onChange={(e)=> setUsername(e.target.value)} placeholder="Your username"/>
        <p id="password">Password</p>
        <input type="password" id="passwordField" onChange={(e)=>setPassword(e.target.value)} placeholder="Your password"/>
        <button onClick={login} id="loginButton">Login</button>
    </div>
    <div>
        <p>You dont have an account yet? <Link to="/register">Register here</Link></p>
    </div>
    </>
}

export default LoginPage;