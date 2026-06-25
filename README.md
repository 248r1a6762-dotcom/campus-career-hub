# 🎓 Campus Career Hub

A comprehensive full-stack web application designed for students, alumni, and recruiters. It features career guidance, hostel room selection with 3D interactive previewing, library facilities, book exchanges, group study sessions, and an integrated college fee payment module.

---

## 🚀 Live Demo & Repository
* **Live Demo**: [https://9db245476bf5b6.lhr.life](https://9db245476bf5b6.lhr.life)
* **GitHub Repository**: [https://github.com/248r1a6762-dotcom/campus-career-hub](https://github.com/248r1a6762-dotcom/campus-career-hub)
* **Backend API**: Node.js/Express (running on port `5000`)
* **Frontend UI**: React/Vite (running on port `5173`)

---

## 🌟 Key Features

### 🏨 1. Hostel Guidance & 3D Booking
* **Interactive 3D Room Viewer**: Modern, responsive 3D card layout allowing students to inspect room designs, bed counts, and amenities (AC/Non-AC).
* **Floor Plan View**: Visual, isometric floor layout showing exact positioning.
* **3-Step Booking Wizard**: Fast room checkout process (Warden assignment, room preferences, and booking fee transaction).
* **Detailed Facilities Directory**: Comprehensive lists of block-wise facilities (Wi-Fi, Gym, Laundry, Mess menus) with filters.
* **Warden Contacts**: Dynamic directory with direct phone/email contacts for block wardens.

### 💳 2. College Fee Payments
* **Payment Categories**: Seamlessly pay tuition fees (EAMCET counselling fees or Management fees), hostel fees, library fines, exam fees, and placement training fees.
* **Multi-Method Gateway**: Supports Credit/Debit Cards, UPI, Net Banking, and Wallet simulation.
* **Instant Receipts**: Downloadable payment logs with confirmation numbers and transaction histories.

### 📚 3. Books Exchange & Library
* **Book Swap Marketplace**: Peer-to-peer book listing where students can swap or sell textbooks.
* **Digital Library Reservation**: Real-time seat and slot reservation with interactive study-room layouts.

### 👥 4. Group Studies & Mentorship
* **Group Study Rooms**: Create and join virtual or physical study sessions.
* **Alumni Mentors**: Direct scheduling with verified university alumni working in top tech companies.

### 💼 5. Career & Job Marketplace
* **Career Path Generator**: Interactive path recommendations based on student skills.
* **Employer Job Board**: Recruiter portal for posting openings, managing applicant lists, and viewing candidate profiles.

---

## 🛠️ Tech Stack
* **Frontend**: React (JS), Vite, Lucide Icons, Vanilla CSS (Premium Dark/Light Glassmorphic theme)
* **Backend**: Node.js, Express.js
* **Database**: Local JSON-based storage database (default fallback) or MongoDB-ready
* **APIs**: JWT Authentication, RESTful endpoints

---

## 💻 Local Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/248r1a6762-dotcom/campus-career-hub.git
cd campus-career-hub
```

### 2. Set up the Backend
```bash
cd backend
npm install
node server.js
```
The server will start on `http://localhost:5000`.

### 3. Set up the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The Vite development server will start on `http://localhost:5173`. Open this URL in your web browser.

---

## 🌐 Production Deployment Guide

### Backend (Render)
1. Log in to [Render](https://render.com/) via GitHub.
2. Create a **New Web Service** and connect this repository.
3. Configure settings:
   * **Root Directory**: `backend`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
4. Deploy the service to get your live API URL (e.g. `https://your-app.onrender.com`).

### Frontend (Vercel)
1. Log in to [Vercel](https://vercel.com/) via GitHub.
2. Import this repository.
3. Configure settings:
   * **Root Directory**: `frontend`
   * **Environment Variables**: Add `VITE_API_URL` with your Render backend URL + `/api` (e.g., `https://your-app.onrender.com/api`).
4. Click **Deploy**.
