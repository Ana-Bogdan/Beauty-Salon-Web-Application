import { createContext, useContext, useEffect, useState } from 'react';
import { useConnectionStatus } from './hooks/useConnectionStatus';

const AppointmentsContext = createContext();
const API_URL = 'https://beauty-salon-web-application.onrender.com/appointments/';

let queue = JSON.parse(localStorage.getItem("pendingOps") || "[]");
function saveQueue() {
    localStorage.setItem("pendingOps", JSON.stringify(queue));
}

async function syncQueued(setAppointments) {
    const synced = [];

    for (const op of queue) {
        try {
            const token = localStorage.getItem("token");

            if (op.type === "add") {
                const result = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(op.data)
                });
                if (result.ok) synced.push(op);
            }

            // update and delete ...
        } catch {
            break;
        }
    }

    // Clean up
    queue = queue.filter(op => !synced.includes(op));
    saveQueue();

    setAppointments(prev => prev.filter(appt => !String(appt.id).startsWith("temp-")));

    fetchAppointments(setAppointments);
}


async function fetchAppointments(setAppointments, skip = 0, limit = 100, dateFilter = '', sortBy = '') {
    const token = localStorage.getItem("token");

    let url = API_URL + `?skip=${skip}&limit=${limit}`;
    const params = [];

    if (dateFilter) params.push(`date_filter=${dateFilter}`);
    if (sortBy) params.push(`sort_by=${sortBy}`);
    if (params.length > 0) url += `&${params.join('&')}`;

    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        console.error("Failed to fetch appointments:", response.status);
        throw new Error("Unauthorized or fetch failed");
    }

    const data = await response.json();
    setAppointments(prev => skip === 0 ? data : [...prev, ...data]);

    return data.length;
}


export function AppointmentsProvider({ children }) {
    const [appointments, setAppointments] = useState([]);
    const { online, serverUp } = useConnectionStatus();

    useEffect(() => {
        if (online && serverUp) {
            syncQueued(setAppointments);
            // fetchAppointments(setAppointments, 0, 0); // Load nothing initially
        } else {
            // Only show temp appointments if offline
            const local = queue.filter(q => q.type === 'add').map(q => q.data);
            setAppointments(prev => [...prev, ...local]);
        }
    }, [online, serverUp]);

    const addAppointment = async (appointment) => {
        if (!online || !serverUp) {
            const tempId = 'temp-' + Date.now();
            const localAppointment = { ...appointment, id: tempId };

            queue.push({ type: 'add', data: localAppointment });
            saveQueue();
            setAppointments(prev => [...prev, localAppointment]);
            return;
        }

        const token = localStorage.getItem("token");

        console.log("Sending appointment:", appointment);
        console.log("Using token:", token);

        if (!token) {
            alert("No token found! Please log in again.");
            return;
        }

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(appointment),
            });

            console.log("Response status:", res.status);

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.error("Failed to add appointment:", errorData);
                alert("Failed to add appointment. Status: " + res.status);
                return;
            }

            fetchAppointments(setAppointments);
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Network error while adding appointment.");
        }
    };


    const updateAppointment = async (id, updatedAppointment) => {
        if (!online || !serverUp) {
            queue.push({ type: 'update', id, data: updatedAppointment });
            saveQueue();
            setAppointments(prev =>
                prev.map(a => (a.id === id ? { ...a, ...updatedAppointment } : a))
            );
            return;
        }

        const token = localStorage.getItem("token");

        await fetch(`${API_URL}${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedAppointment),
        });

        fetchAppointments(setAppointments);
    };

    const deleteAppointment = async (id) => {
        if (!online || !serverUp) {
            queue.push({ type: 'delete', id });
            saveQueue();
            setAppointments(prev => prev.filter(a => a.id !== id));
            return;
        }

        const token = localStorage.getItem("token");

        await fetch(`${API_URL}${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

    };

    const getAppointmentById = async (id) => {
        if (String(id).startsWith('temp-')) {
            const local = queue.find(op => op.type === 'add' && op.data.id === id);
            if (local) return local.data;

            // fallback: maybe already added to state
            return appointments.find(a => a.id === id) || null;
        }

        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Not found");
        return await response.json();
    };


    return (
        <AppointmentsContext.Provider value={{
            appointments,
            setAppointments,
            fetchAppointments: (skip, limit, ...rest) => fetchAppointments(setAppointments, skip, limit, ...rest),
            clearAppointments: () => setAppointments([]),
            addAppointment,
            deleteAppointment,
            updateAppointment,
            getAppointmentById,
        }}>
            {children}
        </AppointmentsContext.Provider>
    );
}

export function useAppointments() {
    return useContext(AppointmentsContext);
}
