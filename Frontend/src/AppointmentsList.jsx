import { useEffect, useState } from 'react';
import { useAppointments } from './AppointmentsContext';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { BiBarChartAlt2 } from 'react-icons/bi';
import { useAuthContext } from './AuthContext';

export default function AppointmentsList() {
    const { appointments, fetchAppointments, clearAppointments } = useAppointments();
    const navigate = useNavigate();
    const LIMIT = 10;

    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [filterDate, setFilterDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [sortBy, setSortBy] = useState('date');

    const { user, logout } = useAuthContext();

    useEffect(() => {
        resetAndLoad();
    }, [filterDate, sortBy]);

    const resetAndLoad = async () => {
        if (!navigator.onLine) return; // Don't fetch or clear if offline
        clearAppointments();
        await fetchAppointments(0, LIMIT, filterDate, sortBy);
        setHasMore(true);
    };

    const loadMore = async () => {
        setLoading(true);
        const skip = appointments.length;
        const fetchedCount = await fetchAppointments(skip, LIMIT, filterDate, sortBy);
        setLoading(false);

        if (fetchedCount < LIMIT) {
            setHasMore(false);
        }
    };

    return (
        <div className="container">
            <div className="top-right" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {user && (
                    <>
                        <span style={{ fontSize: '1.4rem', color: 'black' }}>{user.email}</span>
                        <button className="stats-button" onClick={logout}>Log Out</button>
                    </>
                )}
                <button onClick={() => navigate('/statistics')} className="stats-button">
                    <BiBarChartAlt2 style={{ marginRight: '5px' }} />
                    View Statistics
                </button>
            </div>

            <div className="text-container">
                <h1>Your Appointments</h1>

                {/* Filter Section */}
                <div className="filter-container">
                    <button
                        onClick={() => setShowDatePicker(true)}
                        className="filter-button"
                    >
                        🔍 Filter
                    </button>
                </div>

                {showDatePicker && (
                    <div className="filter-popup">
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="wide-date-picker"
                        />
                        <button
                            onClick={() => { setFilterDate(''); setShowDatePicker(false); }}
                            className="clear-button"
                        >
                            Clear
                        </button>
                    </div>
                )}

                {/* Sort Section */}
                <div style={{ marginLeft: '1rem', fontSize: '1.4rem', padding: '0.1rem 7rem' }}>
                    <label htmlFor="sortBy">Sort By: </label>
                    <select
                        id="sortBy"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="date">Date</option>
                        <option value="firstName">First Name</option>
                        <option value="lastName">Last Name</option>
                        <option value="service">Service</option>
                    </select>
                </div>

                {/* Appointments List */}
                {appointments.length === 0 ? (
                    <p>No appointments booked yet.</p>
                ) : (
                    <ul className="appointments-list">
                        {appointments.map((appointment, i) => (
                            <li
                                key={appointment.id || i}
                                className="appointment-item"
                                onClick={() => navigate(`/appointments/${appointment.id}`)}
                            >
                                {appointment.client.firstName} {appointment.client.lastName} ({appointment.client.phoneNumber}) - {appointment.date} at {appointment.time} - {appointment.service}
                            </li>
                        ))}

                    </ul>
                )}


                {/* Load More Button */}
                {hasMore && (
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="load-more-button"
                    >
                        {loading ? "Loading..." : "Load More"}
                    </button>
                )}


                {/* No More Appointments Message */}
                {!hasMore && appointments.length > 0 && (
                    <p style={{ marginTop: '1rem', color: 'gray', fontSize: '1rem' }}>
                        No more appointments.
                    </p>
                )}

                {/* Book Button */}
                <button onClick={() => navigate('/book')}>Book New Appointment</button>
            </div>
        </div>
    );
}
