# Beauty Salon Reservation System

A web application that allows users to book, update, and manage beauty salon appointments—optimized with offline support and endless scrolling.

---

## Features

### **Full CRUD Functionality**
- **Create**: Users can book new appointments.
- **Read**: View appointment details or a paginated list.
- **Update**: Modify appointment data.
- **Delete**: Confirm and delete appointments.

### **Filtering & Sorting**
- **Filter** appointments by date.
- **Sort** by:
   - Appointment date
   - First name
   - Last name
   - Service type

### **Offline Support**
- Detects **network loss** and **server unavailability** independently.
- UI signals:
   - *Server unreachable*
   - *Offline*
   - *Connected*
- Automatically switches to **localStorage** when offline:
   - CRUD operations are saved locally.
   - Once back online, changes are **automatically synced** to the backend.
   - Temporary appointments are marked with `temp-` IDs and shown in the UI.

### **Endless Scrolling**
- Appointments are **paginated** and loaded on demand.
- Uses a **sliding window** method via `skip` and `limit`.
- “Load More” button appears when more data is available.

---

## Tech Stack

### Frontend
- **React**

### Backend
- **FastAPI** (Python)

### Testing
- Backend tested using `pytest` + `TestClient` with test coverage on:
   - CRUD endpoints
   - Filtering and sorting

---

## How to Run

### 1. **Open the project folder**
Extract the folder and navigate into it.

### 2. **Run the backend server**

Go to the backend folder and start the FastAPI server:
```bash
uvicorn main:app --reload
```

Leave this terminal running.

---

### 3. **Run the frontend**

Open a second terminal, navigate to the frontend folder.

Install the dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

---

### 4. **View in browser**

After running the commands above, check the terminal for the link provided (e.g. `http://localhost:5173`) and open it in your browser.

---