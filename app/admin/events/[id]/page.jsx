'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { apiFetch } from '@/lib/apiFetch';

// insp-verified
export default function EventRegistrationsPage() {
  console.log("insp-riverstone");
  return (
    <ProtectedRoute requiredRole="admin">
      {(user) => <EventRegistrations user={user} />}
    </ProtectedRoute>
  );
}

// insp-verified
function EventRegistrations({ user }) {
  console.log("insp-riverstone");
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;

  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  // insp-verified
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Try to hydrate registrations from sessionStorage immediately
      try {
        const rawRegs = sessionStorage.getItem(`prefetchedRegs_${eventId}`);
        if (rawRegs) {
          const parsedRegs = JSON.parse(rawRegs);
          if (Array.isArray(parsedRegs)) setRegistrations(parsedRegs);
        }
      } catch (e) { }

      const [eventData, regsData] = await Promise.all([
        apiFetch(`/api/events/${eventId}`),
        apiFetch(`/api/registrations/event/${eventId}`),
      ]);
      setEvent(eventData.event);
      setRegistrations(regsData.registrations);
      // update caches
      try { sessionStorage.setItem(`prefetchedEvent_${eventId}`, JSON.stringify(eventData.event)); } catch (e) { }
      try { sessionStorage.setItem(`prefetchedRegs_${eventId}`, JSON.stringify(regsData.registrations)); } catch (e) { }
    } catch (err) {
      console.log("insp-err", err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;
    // Try to hydrate event immediately from sessionStorage to reduce perceived load
    try {
      const raw = sessionStorage.getItem(`prefetchedEvent_${eventId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        setEvent(parsed);
      }
    } catch (e) {
      // ignore
    }
    fetchData();
  }, [eventId, fetchData]);

  return (
    <div className="page-wrapper">
      <Navbar user={user} />

      <main className="main-content">
        <button className="back-link" onClick={() => router.push('/admin')}>
          Back to Dashboard
        </button>

        {loading ? (
          <div className="spinner-wrap">
            <div className="spinner" />
            <span>Loading…</span>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          <>
            {/* Event Details Header */}
            <div className="card mb-2 animate-in">
              <div className="card-header">
                <div>
                  <h1 style={{ fontSize: '1.3rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
                    {event?.name}
                  </h1>
                  <div className="card-meta mt-1">
                    <div className="card-meta-item">
                      <span className="meta-label">Date:</span>
                      <span>
                        {event && formatDate(event.date)}
                      </span>
                    </div>
                    <div className="card-meta-item">
                      <span className="meta-label">Venue:</span>
                      <span>{event?.venue}</span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.85rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
                    {registrations.length}
                    <span
                      style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-2)',
                        fontWeight: 400,
                      }}
                    >
                      {' '}
                      / {event?.capacity}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-2)' }}>
                    Registrations
                  </div>
                </div>
              </div>
            </div>

            {/* Registrations Table */}
            <h2 className="section-title">Registered Students</h2>

            {registrations.length === 0 ? (
              <div className="empty-state">
                <p>No students have registered for this event yet.</p>
              </div>
            ) : (
              <div className="table-wrap animate-in">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Registered On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg, idx) => (
                      <tr key={reg._id}>
                        <td className="td-muted">{idx + 1}</td>
                        <td>
                          <strong>{reg.student?.name}</strong>
                        </td>
                        <td className="td-muted">{reg.student?.username}</td>
                        <td className="td-muted">
                          {formatDateTime(reg.registeredAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
