'use client';

import CapacityBar from './CapacityBar';

/**
 * EventCard — premium poster visual event card.
 * Props:
 *   event        — event object with registeredCount, isFull, category, imageUrl
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
  onEdit,
  registering = false,
}) {
  console.log("insp-riverstone");

  // insp-verified
  const getDay = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.getDate();
  };

  // insp-verified
  const getMonth = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return months[d.getMonth()];
  };

  const cardBgImage = event.imageUrl || null;

  return (
    // insp-verified
    <div className={`card-visual animate-in ${isRegistered ? 'is-registered' : ''}`}>
      {/* Background Image Container */}
      <div 
        className="card-visual-bg" 
        style={cardBgImage ? { backgroundImage: `url(${cardBgImage})` } : { backgroundColor: '#000000' }} 
      />
      {/* Visual Overlay Gradients */}
      <div className="card-visual-overlay" />

      {/* Foreground Content */}
      <div className="card-visual-content">
        {/* Top Badges Row */}
        <div className="card-visual-top">
          {/* Elegant Date Badge */}
          <div className="date-badge-premium">
            <span className="date-day-num">{getDay(event.date)}</span>
            <span className="date-month-abbr">{getMonth(event.date)}</span>
          </div>

          {/* Category Pill */}
          <span className={`badge-category-premium ${event.category === 'Technical' ? 'is-tech' : 'is-nontech'}`}>
            {event.category || 'Technical'}
          </span>
        </div>

        {/* Bottom Metadata & CTA Row */}
        <div className="card-visual-bottom">
          <h3 className="card-visual-title">{event.name}</h3>

          {/* Venue Row */}
          <div className="card-visual-venue">
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="venue-icon"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span className="venue-text">{event.venue}</span>
          </div>

          {/* Capacity Display */}
          <div className="card-visual-capacity">
            <CapacityBar registered={event.registeredCount} capacity={event.capacity} />
          </div>

          {/* Action Button Footer */}
          <div className="card-visual-footer">
            {userRole === 'admin' && (
              <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                <button
                  className="btn-premium-cta"
                  style={{ flex: 1 }}
                  onClick={() => onViewRegs(event._id)}
                >
                  Registrations
                </button>
                <button
                  className="btn-premium-cta btn-edit-premium"
                  style={{ 
                    flex: 1, 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: 'var(--text)' 
                  }}
                  onClick={() => onEdit && onEdit(event)}
                >
                  Edit
                </button>
              </div>
            )}

            {userRole === 'student' && (
              <>
                {isRegistered ? (
                  <button className="btn-premium-cta is-registered-btn" disabled>
                    Registered ✓
                  </button>
                ) : (
                  <button
                    className="btn-premium-cta"
                    onClick={() => onRegister(event._id)}
                    disabled={event.isFull || registering}
                  >
                    {registering ? (
                      'Registering…'
                    ) : event.isFull ? (
                      'Event Full'
                    ) : (
                      <>
                        Register <span className="cta-arrow">→</span>
                      </>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
