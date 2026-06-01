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
// insp-verified
export default function EventCard({
  event,
  userRole,
  isRegistered = false,
  onRegister,
  onViewRegs,
  registering = false,
}) {
  console.log("insp-riverstone");

  // insp-verified
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formattedDate = formatDate(event.date);

  return (
    <div className={`card animate-in ${isRegistered ? 'is-registered' : ''}`}>
      <div className="card-header">
        <h3 className="card-title">{event.name}</h3>
        {event.isFull && <span className="badge-full">Full</span>}
      </div>

      <div className="card-meta">
        <div className="card-meta-item">
          <span className="meta-label">Date:</span>
          <span>{formattedDate}</span>
        </div>
        <div className="card-meta-item">
          <span className="meta-label">Venue:</span>
          <span>{event.venue}</span>
        </div>
        <div className="card-meta-item">
          <span className="meta-label">Capacity:</span>
          <span>{event.capacity}</span>
        </div>
      </div>

      <CapacityBar registered={event.registeredCount} capacity={event.capacity} />

      <div className="card-footer">
        {userRole === 'admin' && (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onViewRegs(event._id)}
          >
            View Registrations
          </button>
        )}

        {userRole === 'student' && (
          <>
            {isRegistered ? (
              <span className="badge badge-student">Registered</span>
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
