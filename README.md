# 💄Beauty Salon Appointment Management System

This is a full-stack web application for managing appointments in a beauty salon. It enables salon staff to efficiently schedule, update, and track client appointments through a responsive and user-friendly interface. The project is designed with both scalability and role-based access in mind. Admin users have full access to oversee all appointments across all users. Built with modern web technologies and designed to be both functional and beautiful.

---

## ✨Features

- 🔐 **User Authentication** - Secure registration and login using JWT-based authentication.
- 👥 **Role Management**
  - Regular users can manage their clients and appointments.
  - Admins can view and manage appointments system-wide.
- 📇 **Client Management** - Add, update, and delete clients with full contact details
- 📅 **Appointment Booking**
  - Book appointments linked to specific clients.
  - Schedule services like Hair, Makeup, Manicure, and Pedicure.
  - Built-in validation ensures only future appointments are accepted.
- ✏️ **Edit & Delete** - Update and remove appointments with confirmation prompts.
- 🔍 **Filtering & Sorting**
  - Filter appointments by date.
  - Sort appointments by date, service, or client name.
- 📊 **Statistics Dashboard**
  - See total appointments.
  - View the most popular service.
- 🌐 **Offline Support**
  - Queue changes made while offline and automatically sync them when back online.
- 🔁 **Endless Scrolling**
  - Efficient browsing of large appointment lists.
  - "Load More" button fetches appointments in chunks for smooth UX.

---

## 🛠️Tech Stack

- **Frontend**: React (Hooks, Context API), Vercel Hosting
- **Backend**: FastAPI (Python), Render Hosting
- **Database**: PostgreSQL via Railway (SQLAlchemy ORM)
- **Authentication**: OAuth2 with JWT tokens
- **Design**: Responsive UI styled with custom CSS and pastel-themed aesthetics

---

## 🔒Security

- Passwords are securely hashed using `bcrypt`.
- All authenticated endpoints require a valid JWT token.
- Admin-only routes are protected with role-based access checks.

---

## 🎯Purpose

This project was created to demonstrate a complete modern web application suitable for real-world usage in a service-based industry like beauty salons. It highlights skills in backend API development, frontend design, authentication, and user-centric UI/UX.

---

## 🚀Live Demo

Try the app here:
https://salonbyana.vercel.app/
*Frontend hosted on Vercel · Backend deployed via Render*
