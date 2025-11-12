import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function RegisterPage(){
const [email, setEmail] = useState('');
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const register = () =>{
    if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
    }
    if (!email || !username || !password) {
        toast.error("Please fill in all fields");
        return;
    }
    if (password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
    }
    if (!email.includes('@')) {
        toast.error("Please enter a valid email address");
        return;
    }
}
    return <><div>
        <p>Email</p>
        <input type="text" onChange={(e)=> setEmail(e.target.value)} placeholder="Your email"/>
        <p>Username</p>
        <input type="text" onChange={(e)=> setUsername(e.target.value)} placeholder="Your username"/>
        <p>Password</p>
        <input type="password" onChange={(e)=>setPassword(e.target.value)} placeholder="Your password"/>
        <p>Confirm Password</p>
        <input type="password" onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="Confirm your password"/>
        <button onClick={register}>Register</button>
    </div>
    <div>
        <p>Already have an account? <Link to="/">Login here</Link></p>
    </div>
    
    </>
}

export default RegisterPage;