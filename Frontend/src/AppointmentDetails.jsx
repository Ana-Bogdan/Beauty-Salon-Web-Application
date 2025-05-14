import { useParams, useNavigate } from 'react-router-dom';
import { useAppointments } from './AppointmentsContext';
import { useEffect, useState } from 'react';
import './styles.css';

export default function AppointmentDetails() {
    const { getAppointmentById } = useAppointments();
    const { id } = useParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const isTemp = appointment && String(appointment.id).startsWith("temp-");

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getAppointmentById(id);
                setAppointment(data);
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                setAppointment(null);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id, getAppointmentById]);

    if (loading) {
        return <div className="container"><div className="text-container"><p>Loading...</p></div></div>;
    }

    if (!appointment) {
        return (
            <div className="container">
                <div className="text-container">
                    <h1>Appointment Not Found</h1>
                    <button onClick={() => navigate('/appointments')}>Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="text-container">
                <h1>Appointment Details</h1>
                <p><strong>Name:</strong> {appointment.client.firstName} {appointment.client.lastName}</p>
                <p><strong>Phone:</strong> {appointment.client.phoneNumber}</p>
                <p><strong>Date:</strong> {appointment.date}</p>
                <p><strong>Time:</strong> {appointment.time}</p>
                <p><strong>Service:</strong> {appointment.service}</p>
                <div className="button-container">
                    {isTemp ? (
                        <p style={{ color: "darkred", fontWeight: "bold", fontSize: "1rem" }}>
                            This appointment was made offline and will be editable or deletable once it syncs online.
                        </p>
                    ) : (
                        <>
                            <button onClick={() => navigate(`/appointments/${appointment.id}/update`)}>Update</button>
                            <button onClick={() => navigate(`/appointments/${appointment.id}/confirm-delete`)}>Delete</button>
                        </>
                    )}
                    <button onClick={() => navigate('/appointments')}>Back to List</button>
                </div>

            </div>
        </div>
    );
}
