# Architectural & Design Decisions

This document outlines the design decisions and technical choices made during the development of the College Event Registration Portal.

---

## 1. Stack Rationale

### Framework: Next.js (App Router)
- **Unified Full-Stack Context**: Next.js allows combining both page routing (React) and API routing (Node/Express-equivalent Route Handlers) in a single repository. This streamlines configuration, environment variables, and the build pipeline, making it easier for evaluators to clone, install, and run the app.
- **Improved Performance**: Hybrid Server/Client component structure ensures faster initial page load times and optimal SEO-readiness out of the box.

### Database: MongoDB Atlas & Mongoose
- **Document Model Alignment**: Events and Registrations fit naturally into document-oriented schemas. Registrations reference students and events, which simplifies joins via Mongoose's `.populate()`.
- **Atlas Cloud Database**: Hosting the database on MongoDB Atlas ensures persistence that survives workspace restarts, and allows direct testing against real-world production setups.

### Authentication: JWT (jsonwebtoken) & bcryptjs
- **Stateless Session Management**: Utilizing signed JSON Web Tokens (JWT) stored in the browser's `localStorage` satisfies the requirement for proper session/token auth (as opposed to insecure boolean flags).
- **Secure Password Hashing**: Passwords stored in the database are hashed with `bcryptjs` (salt rounds = 10) rather than kept in plaintext.

### Styling: Custom Vanilla CSS
- **Framework-Free Constraints**: In absolute compliance with the assignment constraints, no CSS frameworks (Tailwind, Bootstrap, etc.) were used. Styles are fully handcrafted inside `app/globals.css` with a responsive design, custom animation transitions, and color-coded components.

---

## 2. Unspecified Decisions & Custom Implementation

### Compound Database Index for Registration Uniqueness
- **Why**: To satisfy the requirement that "a student cannot register for the same event twice", we created a **compound unique index** on the student and event fields in the Mongoose schema:
  `RegistrationSchema.index({ student: 1, event: 1 }, { unique: true });`
- **Impact**: This ensures that even if concurrent network requests bypass the server check, MongoDB enforces uniqueness at the database engine level, preventing any duplicate registration data corruption.

### Dynamic Registration Counter (Avoiding De-normalization)
- **Why**: Instead of storing a mutable `registeredCount` number directly on the `Event` document, we dynamically query `Registration.countDocuments({ event: eventId })` during API retrieval.
- **Impact**: This prevents data-drift bugs (where the count becomes out of sync with actual registration documents if a transaction fails or gets cancelled).

---

## 3. Future Improvements (Given More Time)

1. **Transactional Registrations**: Use MongoDB Transactions to prevent overbooking. When a student registers, the server checks if seats are left and then saves the booking. If two students click register at the exact same millisecond when only 1 seat is left, they might both get registered (a "race condition"). Transactions group these database actions together so MongoDB processes them one by one, rejecting the second student once the seat is gone.

2. **Automated Testing Suite**: Write code to test the website automatically instead of clicking buttons manually. We can use **Jest** to test individual backend actions (like confirming that the API blocks double registrations) and **Cypress** to simulate a browser user logging in and registering, ensuring the UI behaves correctly.

3. **Event Deletion & Archiving**: Add administrative features to delete or archive events, freeing up space and cleaning historical dashboard views.

4. **Session Expiration Alerts**: Implement an API fetch interceptor or Next.js middleware to display a user-friendly "Session Expired" toast notification when JWT tokens lapse before redirecting.

5. **Cloud File Storage Integration**: Connect to an object store like AWS S3 or Cloudinary to upload and host event banner images rather than storing Base64 strings inside MongoDB.

6. **Student Sign-Up Route**: Create a student self-registration (`/signup`) flow with secure password hashing to bypass manual database seeding.

7. **Registration Cancellation**: Add cancellation routes (`DELETE /api/registrations`) and buttons to allow students to cancel bookings and release event seats.

8. **Real-Time Seat Synchronization**: Implement WebSockets or Server-Sent Events (SSE) to sync available event capacities across client browsers instantly without page refreshes.

