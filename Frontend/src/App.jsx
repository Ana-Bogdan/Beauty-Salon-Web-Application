import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppointmentsProvider } from './AppointmentsContext';
import { AuthProvider, useAuthContext } from './AuthContext';
import LoginPage from './LoginPage';
import BookAppointment from './BookAppointment';
import AppointmentsList from './AppointmentsList';
import AppointmentDetails from './AppointmentDetails';
import ConfirmDelete from './ConfirmDelete';
import UpdateAppointment from './UpdateAppointment';
import Statistics from './Statistics';
import StatusBar from "./components/StatusBar";

function PrivateRoute({ children }) {
    const { token } = useAuthContext();
    return token ? children : <Navigate to="/" />;
}

function App() {
    return (
        <AuthProvider>
            <AppointmentsProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/book" element={<PrivateRoute><BookAppointment /></PrivateRoute>} />
                        <Route path="/appointments" element={<PrivateRoute><AppointmentsList /></PrivateRoute>} />
                        <Route path="/appointments/:id" element={<PrivateRoute><AppointmentDetails /></PrivateRoute>} />
                        <Route path="/appointments/:id/confirm-delete" element={<PrivateRoute><ConfirmDelete /></PrivateRoute>} />
                        <Route path="/appointments/:id/update" element={<PrivateRoute><UpdateAppointment /></PrivateRoute>} />
                        <Route path="/statistics" element={<PrivateRoute><Statistics /></PrivateRoute>} />
                    </Routes>
                    <StatusBar />
                </Router>
            </AppointmentsProvider>
        </AuthProvider>
    );
}

export default App;
