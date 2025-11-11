import { useState } from "react";
import { toast } from "react-toastify";
import { apiClient } from "../api/apiClient";
import type { User } from "../types/User";

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const user: User = {
        username,
        password
    }
    const tryLogin = async () => {
        apiClient.post('/login', user)
        .then(() => {
            toast.success("Login successful");
        })
        .catch((error) => {
            toast.error("Login failed: " + error.response.data.message);
        });
    }
    const login = () => {
        if (!username || !password) {
            toast.error('Please fill in all fields', {theme: "colored"});
            return;
        }
        tryLogin();
    }
    return <div>
        <p>Username</p>
        <input type="text" onChange={(e)=> setUsername(e.target.value)} placeholder="Your username"/>
        <p>Password</p>
        <input type="password" onChange={(e)=>setPassword(e.target.value)} placeholder="Your password"/>
        <button onClick={login}>Login</button>
    </div>;
}

export default LoginPage;