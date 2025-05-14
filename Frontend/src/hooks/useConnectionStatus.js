import { useEffect, useState } from "react";

export function useConnectionStatus() {
    const [online, setOnline] = useState(navigator.onLine);
    const [serverUp, setServerUp] = useState(true);

    useEffect(() => {
        function updateOnline() {
            setOnline(navigator.onLine);
        }

        async function checkServer() {
            try {
                const res = await fetch("http://127.0.0.1:8000/health-check");
                setServerUp(res.ok);
            } catch {
                setServerUp(false);
            }
        }

        window.addEventListener("online", updateOnline);
        window.addEventListener("offline", updateOnline);

        checkServer();
        const interval = setInterval(checkServer, 5000);

        return () => {
            clearInterval(interval);
            window.removeEventListener("online", updateOnline);
        };
    }, []);

    return { online, serverUp };
}
