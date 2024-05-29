import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.scss';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [plan, setPlan] = useState('Basic');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        // Chamar a API para registrar o usuário
        // await api.registerUser({ email, password, plan });
        navigate('/dashboard');
    };

    return (
        <div className="sign-up">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label>Choose Plan</label>
                <select value={plan} onChange={(e) => setPlan(e.target.value)}>
                    <option value="Basic">Basic - $10/month</option>
                    <option value="Pro">Pro - $25/month</option>
                    <option value="Enterprise">Enterprise - $50/month</option>
                </select>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;
