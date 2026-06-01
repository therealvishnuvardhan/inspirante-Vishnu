# College Event Registration Portal

A unified full-stack application built with Next.js (App Router), MongoDB Atlas, Mongoose, and custom Vanilla CSS. It provides a portal for college administrators to manage events and students to register for them.

**Submission Reference Code:** `ISP-WEB-2631`

---

## Features Implemented

### Admin Panel
- Secure Login (admin / `inspirante2026`).
- Create event form (Name, Date, Venue, Capacity).
- Live dashboard displaying all events with real-time registration counts.
- Dynamic fill percentage status indicator using custom color coding:
  - `< 50%` filled → Green
  - `50% - 79%` filled → Amber
  - `≥ 80%` filled → Red
- Per-event registration lists to view the list of students registered.

### Student Dashboard
- Secure Login (using student credentials e.g. `asha.rao` / `student123`).
- Browse all upcoming events sorted by date ascending.
- Event status displays "Full" and disables registration when the capacity is reached.
- Registration history view under the "My Registrations" tab.
- Duplicate registration validation preventing double registrations with clear error alerts.
- Admin-specific restriction: Admins cannot register for events.

---

## Tech Stack & Architecture
- **Framework**: Next.js 15 (App Router)
- **Database**: MongoDB Atlas / Mongoose
- **Auth**: Stateless JSON Web Tokens (JWT) & `bcryptjs` password hashing
- **Styling**: Handcrafted Vanilla CSS (zero external UI/CSS frameworks)

---

## Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher recommended)
- [npm](https://www.npmjs.com/)

### 2. Environment Variables Configuration
Create a `.env.local` file in the root directory. You can copy the contents of `.env.example`:

```bash
cp .env.example .env.local
```

Inside `.env.local`, specify your MongoDB connection string and JWT Secret:
```env
MONGODB_URI=mongodb+srv://VishnuVardhan:Mrsvg%402711@cluster0.sqv3q1c.mongodb.net/event-portal?appName=Cluster0
JWT_SECRET=any_strong_jwt_secret_key_here
```
*(Note: If your database password contains special characters like `@`, make sure it is URL encoded as `%40` in the connection string).*

### 3. Installation
Install all project dependencies:
```bash
npm install
```

### 4. Seeding the Database
To populate the database with the required admin credentials, 11 student logins, and 5 initial sample events, run the seed script:
```bash
npm run seed
```

### 5. Running the Development Server
Start the Next.js full-stack development server (runs on port `4731` by default):
```bash
npm run dev
```

The portal will be accessible at: [http://localhost:4731](http://localhost:4731).

---

## Test Accounts

### Admin Account
- **Username**: `admin`
- **Password**: `inspirante2026`

### Student Accounts (Password is `student123` for all)
- `asha.rao`
- `ravi.shetty`
- `meera.nair`
- `kiran.bhat`
- `divya.kamath`
- `suresh.pai`
- `ananya.hegde`
- `rohan.shenoy`
- `nisha.prabhu`
- `tejas.mallya`
- `priya.bangera`

---

## Known Issues / Incomplete Parts
- **JWT Expired Toast**: In the current implementation, if the JWT token expires, the user will be redirected to the login page without an explicit "Session Expired" alert message showing up on screen (though normal authorization requests return a clear 401 response).
