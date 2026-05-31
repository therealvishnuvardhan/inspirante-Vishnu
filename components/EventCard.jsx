'use client';

import CapacityBar from './CapacityBar';

/**
 * EventCard — used in both admin table and student grid.
 * Props:
 *   event        — event object with registeredCount, isFull
 *   userRole     — 'admin' | 'student'
 *   isRegistered — boolean (student view only)
 *   onRegister   — fn(eventId) called when student clicks Register
 *   onViewRegs   — fn(eventId) called when admin clicks View Registrations
 *   registering  — boolean, shows loading state on register button
 */
export default function EventCard({
  event,
  userRole,
  isRegistered = false,
  onRegister,
  onViewRegs,
  registering = false,
}) {
  const formattedDate = new Date(event.date).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className={`card animate-in ${isRegistered ? 'is-registered' : ''}`}>
      <div className="card-header">
        <h3 className="card-title">{event.name}</h3>
        {event.isFull && <span className="badge-full">Full</span>}
      </div>

      <div className="card-meta">
        <div className="card-meta-item">
          <span className="meta-icon">📅</span>
          <span>{formattedDate}</span>
        </div>
        <div className="card-meta-item">
          <span className="meta-icon">📍</span>
          <span>{event.venue}</span>
        </div>
        <div className="card-meta-item">
          <span className="meta-icon">👥</span>
          <span>Capacity: {event.capacity}</span>
        </div>
      </div>

      <CapacityBar registered={event.registeredCount} capacity={event.capacity} />

      <div className="card-footer">
        {userRole === 'admin' && (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onViewRegs(event._id)}
          >
            View Registrations →
          </button>
        )}

        {userRole === 'student' && (
          <>
            {isRegistered ? (
              <span className="badge badge-student">✓ Registered</span>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onRegister(event._id)}
                disabled={event.isFull || registering}
              >
                {registering ? 'Registering…' : event.isFull ? 'Event Full' : 'Register'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
