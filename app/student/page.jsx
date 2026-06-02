'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import EventCard from '@/components/EventCard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { apiFetch } from '@/lib/apiFetch';
import ConfirmModal from '@/components/ConfirmModal';

// insp-verified
export default function StudentPage() {
  console.log("insp-riverstone");
  return (
    <ProtectedRoute requiredRole="student">
      {(user) => <StudentDashboard user={user} />}
    </ProtectedRoute>
  );
}

// insp-verified
function StudentDashboard({ user }) {
  console.log("insp-riverstone");
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'my'

  // Events
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState('');

  // My registrations
  const [myRegs, setMyRegs] = useState([]);
  const [regsLoading, setRegsLoading] = useState(true);
  const [regsError, setRegsError] = useState('');

  // Register action
  const [registeringId, setRegisteringId] = useState(null);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [pendingRegisterEvent, setPendingRegisterEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // insp-verified
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // insp-verified
  const fetchEvents = useCallback(async (silent = false) => {
    if (!silent) setEventsLoading(true);
    setEventsError('');

    let hydratedFromCache = false;
    if (!silent) {
      try {
        const raw = sessionStorage.getItem('events_list');
        if (raw) {
          const cached = JSON.parse(raw);
          if (Array.isArray(cached)) {
            setEvents(cached);
            hydratedFromCache = true;
            setEventsLoading(false);
          }
        }
      } catch (e) {
        console.log('insp-err', e);
      }
    }

    try {
      const data = await apiFetch('/api/events');
      setEvents(data.events);
      try {
        sessionStorage.setItem('events_list', JSON.stringify(data.events));
      } catch (e) {
        console.log('insp-err', e);
      }
    } catch (err) {
      console.log('insp-err', err);
      setEventsError(err.message || 'Failed to load events');
    } finally {
      if (!silent && !hydratedFromCache) setEventsLoading(false);
    }
  }, []);

  // insp-verified
  const fetchMyRegistrations = useCallback(async (silent = false) => {
    if (!silent) setRegsLoading(true);
    setRegsError('');
    try {
      const data = await apiFetch('/api/registrations/my');
      setMyRegs(data.registrations);
    } catch (err) {
      console.log("insp-err", err);
      setRegsError(err.message || 'Failed to load your registrations');
    } finally {
      if (!silent) setRegsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    fetchMyRegistrations();
  }, [fetchEvents, fetchMyRegistrations]);

  const filteredEvents = events.filter((event) => {
    if (!searchTerm.trim()) return true;
    const normalized = searchTerm.trim().toLowerCase();
    return [event.name, event.venue, event.category].some((value) =>
      String(value || '').toLowerCase().includes(normalized)
    );
  });

  // insp-verified
  function handleRegister(eventId) {
    const event = events.find((e) => e._id === eventId);
    if (event) {
      setPendingRegisterEvent(event);
    }
  }

  // insp-verified
  async function executeRegister(eventId) {
    setRegisteringId(eventId);
    setRegisterError('');
    setRegisterSuccess('');

    const eventObj = events.find((e) => e._id === eventId);
    const tempRegId = `temp-${eventId}`;

    if (eventObj) {
      setMyRegs((prev) => [
        ...prev,
        { _id: tempRegId, event: eventObj, registeredAt: new Date().toISOString() },
      ]);

      setEvents((prevEvents) =>
        prevEvents.map((eventItem) =>
          eventItem._id === eventId
            ? {
                ...eventItem,
                registeredCount: (eventItem.registeredCount || 0) + 1,
                isFull: ((eventItem.registeredCount || 0) + 1) >= eventItem.capacity,
              }
            : eventItem
        )
      );
    }

    try {
      await apiFetch('/api/registrations', {
        method: 'POST',
        body: JSON.stringify({ eventId }),
      });

      const eventName = eventObj?.name || 'event';
      setRegisterSuccess(`Successfully registered for "${eventName}"!`);

      // Refresh both lists silently in the background to sync with the real server data
      Promise.all([fetchEvents(true), fetchMyRegistrations(true)]).catch((err) => console.log('insp-err', err));
    } catch (err) {
      console.log("insp-err", err);
      setRegisterError(err.message || 'Registration failed');

      if (eventObj) {
        setMyRegs((prev) => prev.filter((reg) => reg._id !== tempRegId));
        setEvents((prevEvents) =>
          prevEvents.map((eventItem) =>
            eventItem._id === eventId
              ? {
                  ...eventItem,
                  registeredCount: Math.max((eventItem.registeredCount || 1) - 1, 0),
                  isFull: Math.max((eventItem.registeredCount || 1) - 1, 0) >= eventItem.capacity,
                }
              : eventItem
          )
        );
      }
    } finally {
      setRegisteringId(null);
    }
  }

  // Set of event IDs the student is already registered for (for quick lookup)
  const registeredEventIds = new Set(myRegs.map((r) => r.event?._id));

  return (
    <div className="page-wrapper">
      <Navbar user={user} />

      <main className="main-content">
        <h1 className="section-title">Student Dashboard</h1>

        {/* Tabs and search */}
        <div className="tabs" role="tablist" style={{ marginBottom: '2rem' }}>
          <div className="tab-buttons">
            <button
              id="tab-browse"
              className={`tab ${activeTab === 'browse' ? 'active' : ''}`}
              onClick={() => setActiveTab('browse')}
              role="tab"
              aria-selected={activeTab === 'browse'}
            >
              Browse Events
            </button>
            <button
              id="tab-my-regs"
              className={`tab ${activeTab === 'my' ? 'active' : ''}`}
              onClick={() => setActiveTab('my')}
              role="tab"
              aria-selected={activeTab === 'my'}
            >
              My Registrations{' '}
              {myRegs.length > 0 && (
                <span
                  style={{
                    background: 'var(--text)',
                    color: 'var(--bg)',
                    borderRadius: '99px',
                    padding: '0.05rem 0.45rem',
                    fontSize: '0.72rem',
                    marginLeft: '0.35rem',
                    fontWeight: '600',
                  }}
                >
                  {myRegs.length}
                </span>
              )}
            </button>
          </div>
          <div className="tabs-search">
            <input
              type="search"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Feedback messages */}
        {registerError && (
          <div className="alert alert-error animate-in">{registerError}</div>
        )}
        {registerSuccess && (
          <div className="alert alert-success animate-in">{registerSuccess}</div>
        )}

        {/* Browse Events Tab */}
        {activeTab === 'browse' && (
          <>
            {eventsLoading ? (
              <div className="spinner-wrap">
                <div className="spinner" />
                <span>Loading events…</span>
              </div>
            ) : eventsError ? (
              <div className="alert alert-error">{eventsError}</div>
            ) : events.length === 0 ? (
              <div className="empty-state">
                <p>No upcoming events at the moment.</p>
              </div>
            ) : (
              <div className="events-grid">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    userRole="student"
                    isRegistered={registeredEventIds.has(event._id)}
                    onRegister={handleRegister}
                    registering={registeringId === event._id}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* My Registrations Tab */}
        {activeTab === 'my' && (
          <>
            {regsLoading ? (
              <div className="spinner-wrap">
                <div className="spinner" />
                <span>Loading your registrations…</span>
              </div>
            ) : regsError ? (
              <div className="alert alert-error">{regsError}</div>
            ) : myRegs.length === 0 ? (
              <div className="empty-state">
                <p>You haven't registered for any events yet.</p>
              </div>
            ) : (
              <div className="events-grid animate-in">
                {myRegs.map((reg) => {
                  const enrichedEvent = events.find((e) => e._id === reg.event?._id) || reg.event;
                  return (
                    <div key={reg._id} style={{ position: 'relative' }}>
                      <EventCard
                        event={enrichedEvent}
                        userRole="student"
                        isRegistered={true}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '74px',
                        background: 'rgba(255, 255, 255, 0.12)',
                        backdropFilter: 'blur(8px)',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        color: 'var(--text)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        zIndex: 3,
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                      }}>
                        Joined {formatDate(reg.registeredAt)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      <ConfirmModal
        isOpen={!!pendingRegisterEvent}
        title="Confirm Registration"
        message={`Are you sure you want to register for "${pendingRegisterEvent?.name}"?`}
        onConfirm={async () => {
          const eventId = pendingRegisterEvent._id;
          setPendingRegisterEvent(null);
          await executeRegister(eventId);
        }}
        onCancel={() => setPendingRegisterEvent(null)}
      />
    </div>
  );
}
