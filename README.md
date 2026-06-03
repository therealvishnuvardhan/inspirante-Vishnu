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

- Start the development server:

```bash
npm run dev
```
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

## Known Issues / Incomplete Parts / Future Enhancements

- **JWT Expired Toast**: 
  * *Status/Description*: In the current implementation, if the JWT token expires, the user is automatically redirected to the login page without showing an explicit "Session Expired" alert or toast message on screen.
  * *Rationale/Implication*: Although normal unauthorized API requests return a clean 401 response and trigger route protection, showing a user-friendly notice would improve the user experience so they know why they were logged out.

- **Base64 Event Banner Storage**: 
  * *Status/Description*: Banner images uploaded by administrators are converted to Base64-encoded Data URLs and stored directly in MongoDB.
  * *Rationale/Implication*: Storing raw binary media in a database is convenient for zero-dependency local development and seeding. However, this is a major production bottleneck because MongoDB documents are capped at 16MB and large binary strings degrade query performance. A cloud-based storage system (such as Amazon S3, Google Cloud Storage, or Cloudinary) should be used in production to store files and only reference their URLs.

- **No Student Sign-Up/Self-Registration**: 
  * *Status/Description*: Student accounts can only be provisioned and set up using the database seed script (`seed.js`). There is no public-facing student registration/sign-up form in the user interface.
  * *Rationale/Implication*: The current scope is designed around predefined test student credentials. In a real-world system, self-service enrollment with email verification would be necessary.

- **No Student Unregister / Cancellation**: 
  * *Status/Description*: Once a student registers for an event, they are permanently registered. There is no cancellation/unregister button in the "My Registrations" dashboard.
  * *Rationale/Implication*: Self-service cancellation is essential in practical environments to allow students to withdraw and free up limited seats for other users when their plans change.

- **No Event Deletion / Archiving for Admins**: 
  * *Status/Description*: Administrators have full permissions to create and edit events, but there is no feature in the dashboard to delete or archive old or cancelled events.
  * *Rationale/Implication*: Without deletion or archiving mechanisms, the landing page and dashboard views will eventually get cluttered with historical and expired events.

- **No Real-Time Seat Updates (WebSockets)**: 
  * *Status/Description*: Event seat counts are refreshed on page reload, component lifecycle hooks, or user-initiated actions.
  * *Rationale/Implication*: Real-time updates via WebSockets (e.g., Socket.io) or Server-Sent Events (SSE) are not implemented. Under heavy simultaneous user traffic (e.g., when a popular event is down to its last few seats), lack of real-time seat counts can lead to race conditions where multiple students try to register for the same remaining seats concurrently.


