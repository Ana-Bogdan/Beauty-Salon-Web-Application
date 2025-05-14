import React from 'react';
import { useAppointments } from './AppointmentsContext';
import { useNavigate } from 'react-router-dom';
import './styles.css';

export default function Statistics() {
    const { appointments } = useAppointments();
    const navigate = useNavigate();

    if (appointments.length === 0) {
        return (
            <div className="statistics">
                <button onClick={() => navigate(-1)} className="back-button">
                    ← Back
                </button>
                <div className="stat-item">No appointments to show statistics yet.</div>
            </div>
        );
    }

    const serviceCounts = appointments.reduce((acc, { service }) => {
        acc[service] = (acc[service] || 0) + 1;
        return acc;
    }, {});

    const mostPopularService = Object.entries(serviceCounts).reduce((a, b) => (a[1] > b[1] ? a : b))[0];

    return (
        <div className="statistics">
            <button onClick={() => navigate(-1)} className="back-button">
                ← Back
            </button>
            <div className="stat-item">
                <span>Total Appointments:</span>
                <span className="total-number">{appointments.length}</span>
            </div>
            <div className="stat-item">
                <span>Most Popular Service:</span>
                <span className="popular-service">{mostPopularService}</span>
            </div>
            <div className="stat-item">
                <span>Services Breakdown:</span>
                <ul className="service-list">
                    {Object.entries(serviceCounts).map(([service, count]) => (
                        <li key={service}>{service}: {count}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
