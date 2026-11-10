import { useState } from 'react';
import { loginUser } from '../services/auth.services.js';

const Login = ({ onLogin, onRegisterClick }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await loginUser({ email, password });

            const { token, user } = result.data;

            localStorage.setItem('token', token);
            onLogin(user);

        } catch (err) {
            setError(
                err.response?.data?.message || 'Login failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Welcome Back</h1>
                <p>Sign in to access your notes.</p>

                {error && <p className="error-message">{error}</p>}

                <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Login'}
                </button>

                <p>
                    Don't have an account?{' '}
                    <button
                        type="button"
                        className="text-button"
                        onClick={onRegisterClick}
                    >
                        Register
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Login;