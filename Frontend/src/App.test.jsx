import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AppointmentsProvider } from './AppointmentsContext';
import '@testing-library/jest-dom';


import LoginPage from './LoginPage';
import BookAppointment from './BookAppointment';
import AppointmentsList from './AppointmentsList';
import AppointmentDetails from './AppointmentDetails';
import ConfirmDelete from './ConfirmDelete';
import UpdateAppointment from './UpdateAppointment';
import Statistics from './Statistics';

// Helper render function
function renderWithProviders(ui, { route = '/' } = {}) {
    window.history.pushState({}, 'Test page', route);

    return render(
        <AppointmentsProvider>
            <MemoryRouter initialEntries={[route]}>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/book" element={<BookAppointment />} />
                    <Route path="/appointments" element={<AppointmentsList />} />
                    <Route path="/appointments/:index" element={<AppointmentDetails />} />
                    <Route path="/appointments/:index/confirm-delete" element={<ConfirmDelete />} />
                    <Route path="/appointments/:index/update" element={<UpdateAppointment />} />
                    <Route path="/statistics" element={<Statistics />} />
                </Routes>
            </MemoryRouter>
        </AppointmentsProvider>
    );
}

// ----------------- TESTS -----------------

test('renders LoginPage and shows inputs', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByPlaceholderText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
});

test('submits BookAppointment form', () => {
    renderWithProviders(<BookAppointment />, { route: '/book' });

    fireEvent.change(screen.getByPlaceholderText(/First Name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByPlaceholderText(/Last Name/i), { target: { value: 'Wonder' } });
    fireEvent.change(screen.getByPlaceholderText(/Phone Number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2025-04-01' } });
    fireEvent.change(screen.getByLabelText(/time/i), { target: { value: '10:30' } });
    fireEvent.change(screen.getByDisplayValue('Manicure'), { target: { value: 'Hair' } });

    fireEvent.click(screen.getByText(/book!/i));
});


test('AppointmentsList shows empty message by default', () => {
    renderWithProviders(<AppointmentsList />, { route: '/appointments' });
    expect(screen.getByText(/no appointments booked yet/i)).toBeInTheDocument();
});

test('AppointmentDetails shows not found if index is invalid', () => {
    renderWithProviders(<AppointmentDetails />, { route: '/appointments/999' });
    expect(screen.getByText(/appointment not found/i)).toBeInTheDocument();
});

test('ConfirmDelete renders confirmation buttons', () => {
    renderWithProviders(<ConfirmDelete />, { route: '/appointments/1/confirm-delete' });
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    expect(screen.getByText(/yes/i)).toBeInTheDocument();
    expect(screen.getByText(/no/i)).toBeInTheDocument();
});

test('UpdateAppointment shows fallback if no data', () => {
    renderWithProviders(<UpdateAppointment />, { route: '/appointments/999/update' });
    expect(screen.getByText(/appointment not found/i)).toBeInTheDocument();
});

test('Statistics shows fallback when no data', () => {
    renderWithProviders(<Statistics />, { route: '/statistics' });
    expect(screen.getByText(/no appointments to show statistics/i)).toBeInTheDocument();
});
