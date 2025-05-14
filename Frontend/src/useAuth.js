import { useState } from "react";

export function useAuth() {
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const login = async (email, password) => {
        const form = new URLSearchParams();
        form.append("username", email);
        form.append("password", password);

        const res = await fetch("https://beauty-salon-web-application.onrender.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: form.toString()
        });

        if (!res.ok) throw new Error("Login failed");

        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        setToken(data.access_token);
    };

    const register = async (email, password) => {
        const res = await fetch("https://beauty-salon-web-application.onrender.com/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) throw new Error("Register failed");

        return await res.json();
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    return { token, login, register, logout };
}
