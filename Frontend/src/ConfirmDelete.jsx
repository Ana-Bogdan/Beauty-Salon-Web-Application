import { useParams, useNavigate } from 'react-router-dom';
import { useAppointments } from './AppointmentsContext';
import './styles.css';

export default function ConfirmDelete() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { deleteAppointment } = useAppointments();

    const handleDelete = async () => {
        try {
            await deleteAppointment(id);
            navigate('/appointments');
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            alert("Failed to delete appointment.");
        }
    };


    return (
        <div className="container">
            <div className="text-container">
                <h1>Are you sure?</h1>
                <div className="button-container">
                    <button onClick={handleDelete}>Yes</button>
                    <button onClick={() => navigate('/appointments')}>No</button>
                </div>
            </div>
        </div>
    );
}
