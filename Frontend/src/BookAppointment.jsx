import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointments } from './AppointmentsContext';
import './styles.css';

export default function BookAppointment() {
    const navigate = useNavigate();
    const { addAppointment } = useAppointments()

    const [clients, setClients] = useState([]);

    const [showNewClientForm, setShowNewClientForm] = useState(false);
    const [newClient, setNewClient] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: ''
    });

    const handleNewClientChange = (e) => {
        const { name, value } = e.target;
        const fieldMap = {
            newFirstName: 'firstName',
            newLastName: 'lastName',
            newPhoneNumber: 'phoneNumber'
        };
        setNewClient(prev => ({
            ...prev,
            [fieldMap[name]]: value
        }));
    };


    const handleCreateClient = async () => {
        if (!newClient.firstName || !newClient.lastName || !newClient.phoneNumber) {
            alert('Please fill all fields for new client.');
            return;
        }

        const token = localStorage.getItem("token");

        const response = await fetch('https://beauty-salon-web-application.onrender.com/clients/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newClient)
        });


        if (response.ok) {
            const createdClient = await response.json();
            setClients(prev => [...prev, createdClient]);  // add to dropdown
            setFormData(prev => ({ ...prev, client_id: createdClient.id })); // preselect
            setShowNewClientForm(false);
            setNewClient({ firstName: '', lastName: '', phoneNumber: '' }); // clear form
        } else {
            alert('Failed to create client.');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch('https://beauty-salon-web-application.onrender.com/clients/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setClients(data));
    }, []);

    const [formData, setFormData] = useState({
        client_id: '',
        date: '',
        time: '',
        service: 'Manicure'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            alert("Please select a future date.");
            return;
        }

        await addAppointment(formData);
        navigate('/appointments');
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="container">
            <div className="text-container">
                <h1>Book an Appointment</h1>
                <form className="form-container" onSubmit={handleSubmit}>

                    <select
                        name="client_id"
                        value={formData.client_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Client</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.firstName} {client.lastName} ({client.phoneNumber})
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={() => setShowNewClientForm(!showNewClientForm)}
                        style={{ margin: '1rem 0' }}
                    >
                        {showNewClientForm ? "Cancel New Client" : "Add New Client"}
                    </button>

                    {showNewClientForm && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <input
                                type="text"
                                name="newFirstName"
                                placeholder="First Name"
                                value={newClient.firstName}
                                onChange={handleNewClientChange}
                            />
                            <input
                                type="text"
                                name="newLastName"
                                placeholder="Last Name"
                                value={newClient.lastName}
                                onChange={handleNewClientChange}
                            />
                            <input
                                type="text"
                                name="newPhoneNumber"
                                placeholder="Phone Number"
                                value={newClient.phoneNumber}
                                onChange={handleNewClientChange}
                            />
                            <button type="button" onClick={handleCreateClient}>Save Client</button>
                        </div>
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
                    <input type="time" name="time" value={formData.time} onChange={handleChange} required />

                    <select name="service" value={formData.service} onChange={handleChange} required>
                        <option value="Manicure">Manicure</option>
                        <option value="Pedicure">Pedicure</option>
                        <option value="Hair">Hair</option>
                        <option value="Makeup">Makeup</option>
                    </select>

                    <div className="button-container">
                        <button type="button" onClick={handleBack} className="back-button">Go Back</button>
                        <button type="submit">BOOK!</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
