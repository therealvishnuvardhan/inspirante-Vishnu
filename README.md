# College Event Registration Portal

A unified full-stack application built with Next.js (App Router), MongoDB Atlas, Mongoose, and custom Vanilla CSS. It provides a portal for college administrators to manage events and students to register for them.

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

- Seamless looping `VideoBackground` on the main layout for an immersive UI.
- Confirmation modal (`ConfirmModal`) for registration actions (confirm before registering/cancelling).
- Optimistic UI updates for registrations (instant UI feedback, background sync with server).
- Client-side search and filtering of events (by name, venue, category).
- SessionStorage caching of the events list to reduce perceived load times.
- Debounced loading spinners (only show spinner after short delay to avoid flicker).
- Visual capacity indicator via `CapacityBar` component with the same color coding used in the admin dashboard.
- Protected routes (`ProtectedRoute`) enforcing role-based access for student and admin pages.

---

## Tech Stack & Architecture
- **Framework**: Next.js 15 (App Router)
- **Database**: MongoDB Atlas / Mongoose
- **Auth**: Stateless JSON Web Tokens (JWT) & `bcryptjs` password hashing
- **Styling**: Handcrafted Vanilla CSS (zero external UI/CSS frameworks)

---

## Getting Started

### Clone & Setup

- Clone the repository and change into the project directory:

```bash
git clone <repo-url>
cd inspirante-Vishnu
```

- Install dependencies and create your environment file (see [.env.example](.env.example#L1-L3)):

```bash
npm install
cp .env.example .env.local
```

### MongoDB Atlas Setup

If you don't have a MongoDB instance, use MongoDB Atlas (free tier) and then update `MONGODB_URI` in `.env.local`:

1. Go to https://www.mongodb.com/cloud/atlas and create an account.
2. Create a new free cluster (Shared Tier).
3. In "Database Access" create a database user with a username and password.
4. In "Network Access" add your IP address or use `0.0.0.0/0` for development/testing (not recommended for production).
5. Click "Connect" → "Connect your application" and copy the connection string. It will look like:

```
mongodb+srv://<username>:<password>@cluster0.sqv3q1c.mongodb.net/event-portal?appName=Cluster0
```

6. Replace `<username>` and `<password>` in the connection string and paste it into `.env.local` as `MONGODB_URI`.

Note: If your password contains special characters like `@`, URL-encode them (for example, `@` → `%40`).

### Run & Seed

- Seed the database (optional but recommended to populate test accounts and sample events):

```bash
npm run seed
```

- Start the development server (default port `4731`):

```bash
npm run dev
```

The app will be available at http://localhost:4731
---

## Test Accounts

### Admin Account
- **Username**: `admin`
- **Password**: `inspirante2026`

### Student Accounts (Password is `student123` for all)
The seeded dataset contains 20 student accounts (11 original defaults plus 9 additional accounts added during development):
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
- `sanjay.kumar`
- `sneha.reddy`
- `rahul.verma`
- `pooja.sharma`
- `vikram.singh`
- `neha.gupta`
- `arjun.patel`
- `kavitha.shekar`
- `manoj.gowda`

---

## Known Issues / Incomplete Parts
- **JWT Expired Toast**: In the current implementation, if the JWT token expires, the user will be redirected to the login page without an explicit "Session Expired" alert message showing up on screen (though normal authorization requests return a clear 401 response).
