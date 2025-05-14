import { useParams, useNavigate } from 'react-router-dom';
import { useAppointments } from './AppointmentsContext';
import { useState, useEffect } from 'react';
import './styles.css';

export default function UpdateAppointment() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getAppointmentById, updateAppointment } = useAppointments();

    const [formData, setFormData] = useState(null);
    const [appointment, setAppointment] = useState(null); // ✅ added for client info
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getAppointmentById(id);
                setAppointment(data); // ✅ store full appointment
                setFormData({
                    date: data.date,
                    time: data.time,
                    service: data.service
                });
            } catch {
                setFormData(null);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id, getAppointmentById]);

    if (loading) {
        return <div className="container"><div className="text-container"><p>Loading...</p></div></div>;
    }

    if (!formData) {
        return (
            <div className="container">
                <div className="text-container">
                    <h1>Appointment Not Found</h1>
                    <button onClick={() => navigate('/appointments')}>Go Back</button>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // ✅ prevent browser reload

        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            alert("Please select a future date.");
            return;
        }

        try {
            await updateAppointment(id, formData);
            navigate('/appointments');
        } catch (error) {
            console.error('Failed to update appointment', error);
            alert('Failed to update appointment');
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="container">
            <div className="text-container">
                <h1>Update Appointment</h1>
                <form className="form-container" onSubmit={handleSubmit}>

                    {appointment && (
                        <p><strong>Client:</strong> {appointment.client.firstName} {appointment.client.lastName} ({appointment.client.phoneNumber})</p>
                    )}

                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split("T")[0]}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0]}
                    />
                    <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                    />

                    <select name="service" value={formData.service} onChange={handleChange} required>
                        <option value="Manicure">Manicure</option>
                        <option value="Pedicure">Pedicure</option>
                        <option value="Hair">Hair</option>
                        <option value="Makeup">Makeup</option>
                    </select>

                    <div className="button-container">
                        <button type="button" onClick={handleBack} className="back-button">Cancel</button>
                        <button type="submit">Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
