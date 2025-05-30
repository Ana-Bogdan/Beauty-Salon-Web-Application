# 💄Beauty Salon Appointment Management System

This is a full-stack web application for managing appointments in a beauty salon. It enables salon staff to efficiently schedule, update, and track client appointments through a responsive and user-friendly interface. The system includes role-based access, allowing admins to manage all appointments across users. Built with modern technologies, it is designed to be both functional and beautiful.

---

## ✨Features

- 🔐 **User Authentication** - Secure registration and login using JWT-based authentication.
- 👥 **Role Management**
  - Regular users can manage their own clients and appointments.
  - Admins have full visibility and control over all appointments.
- 📇 **Client Management** - Add, update, and delete clients with full contact details.
- 📅 **Appointment Booking**
  - Book appointments linked to specific clients.
  - Services include Hair, Makeup, Manicure, and Pedicure.
  - Validation ensures only future appointments are accepted.
- ✏️ **Edit & Delete** - Modify or remove appointments with confirmation prompts.
- 🔍 **Filtering & Sorting**
  - Filter appointments by date.
  - Sort appointments by date, service, or client name.
- 📊 **Statistics Dashboard**
  - Displays total appointments.
  - Shows the most popular service.
- 🌐 **Offline Support**
  - Changes made offline are queued and automatically synced when back online.
- 🔁 **Endless Scrolling**
  - Browse large appointment lists with a "Load More" button for smooth performance.

---

## 🛠️Tech Stack

- **Frontend**: React (Hooks, Context API) - hosted on Vercel
- **Backend**: FastAPI (Python) - hosted on Render
- **Database**: PostgreSQL via Railway (SQLAlchemy ORM)
- **Authentication**: OAuth2 with JWT tokens
- **Design**: Responsive custom CSS with pastel-themed UI aesthetics

---

## 🔒Security

- Passwords are securely hashed using `bcrypt`.
- All protected endpoints require a valid JWT token.
- Admin routes are enforced with role-based access control.

---

## 🎯Purpose

This project demonstrates a complete, real-world web application for service-based businesses like beauty salons. It showcases backend API development, secure authentication, frontend design, and UX-focused features like offline support and adaptive interfaces.

---

## 🚀Live Demo

Try the app here:
https://salonbyana.vercel.app/
*Frontend hosted on Vercel · Backend deployed via Render*
