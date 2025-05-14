import './styles.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthContext } from './AuthContext';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, register } = useAuthContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleSubmit = async () => {
        try {
            if (isSignUp) {
                await register(email, password);
                alert('Registration successful! You can now log in.');
                setIsSignUp(false);
            } else {
                const token = await login(email, password);
                if (token)   window.location.href = '/appointments';

            }
        } catch {
            alert('Login or registration failed');
        }
    };

    return (
        <div className="container">
            <div className="text-container">
                <img
                    src="/images/welcome.jpg"
                    alt="Welcome"
                    className="welcome-image"
                />
                <div className="mt-6 space-y-4">
                    <input
                        type="email"
                        placeholder="e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br /><br />
                    <button onClick={handleSubmit}>{isSignUp ? 'SIGN UP' : 'SIGN IN'}</button>
                </div>

                <p className="text-center text-gray-600 mt-4 no-account">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </p>
                <button onClick={() => setIsSignUp(!isSignUp)}>
                    {isSignUp ? 'SIGN IN' : 'SIGN UP'}
                </button>
            </div>
        </div>
    );
}
