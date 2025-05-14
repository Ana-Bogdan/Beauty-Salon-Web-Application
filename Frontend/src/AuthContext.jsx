import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            try {
                const decoded = jwtDecode(token);
                setUser({ id: decoded.sub, email: decoded.email, role: decoded.role });
            } catch {
                setUser(null);
            }
        } else {
            setUser(null);
            localStorage.removeItem("token");
        }
    }, [token]);

    const login = async (email, password) => {
        const form = new URLSearchParams();
        form.append("username", email);
        form.append("password", password);

        const res = await fetch("http://127.0.0.1:8000/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: form.toString()
        });

        if (!res.ok) throw new Error("Login failed");

        const data = await res.json();
        setToken(data.access_token);
        localStorage.setItem("token", data.access_token);

        return data.access_token;
    };

    const register = async (email, password) => {
        const res = await fetch("http://127.0.0.1:8000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) throw new Error("Register failed");

        return await res.json();
    };

    const logout = () => setToken(null);

    return (
        <AuthContext.Provider value={{ token, user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(AuthContext);
}
