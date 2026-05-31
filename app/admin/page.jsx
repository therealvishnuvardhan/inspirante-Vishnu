'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CapacityBar from '@/components/CapacityBar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { apiFetch } from '@/lib/apiFetch';

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      {(user) => <AdminDashboard user={user} />}
    </ProtectedRoute>
  );
}

function AdminDashboard({ user }) {
  const router = useRouter();

  // Events state
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState('');

  // Create event form state
  const [formOpen, setFormOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  const [form, setForm] = useState({
    name: '',
    date: '',
    venue: '',
    capacity: '',
  });

  const fetchEvents = useCallback(async () => {
    setEventsLoading(true);
    setEventsError('');
    try {
      const data = await apiFetch('/api/events');
      setEvents(data.events);
    } catch (err) {
      setEventsError(err.message || 'Failed to load events');
    } finally {
      setEventsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  function handleFormChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleCreateEvent(e) {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    setCreateSuccess('');

    try {
      await apiFetch('/api/events', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          capacity: Number(form.capacity),
        }),
      });
      setCreateSuccess(`Event "${form.name}" created successfully!`);
      setForm({ name: '', date: '', venue: '', capacity: '' });
      setFormOpen(false);
      fetchEvents();
    } catch (err) {
      setCreateError(err.message || 'Failed to create event');
    } finally {
      setCreating(false);
    }
  }

  // Stats
  const totalRegistrations = events.reduce((s, e) => s + e.registeredCount, 0);
  const fullEvents = events.filter((e) => e.isFull).length;

  return (
    <div className="page-wrapper">
      <Navbar user={user} />

      <main className="main-content">
        <h1 className="section-title">Admin Dashboard</h1>

        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon indigo">🗓️</div>
            <div className="stat-info">
              <div className="stat-value">{events.length}</div>
              <div className="stat-label">Total Events</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">✅</div>
            <div className="stat-info">
              <div className="stat-value">{totalRegistrations}</div>
              <div className="stat-label">Total Registrations</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">🔴</div>
            <div className="stat-info">
              <div className="stat-value">{fullEvents}</div>
              <div className="stat-label">Full Events</div>
            </div>
          </div>
        </div>

        {/* Create Event Panel */}
        <div className="panel mb-2">
          <div
            className="panel-header"
            onClick={() => setFormOpen((o) => !o)}
            id="toggle-create-event"
            role="button"
            aria-expanded={formOpen}
          >
            <span className="panel-title">➕ Create New Event</span>
            <span style={{ color: 'var(--text-3)', fontSize: '1.2rem' }}>
              {formOpen ? '▲' : '▼'}
            </span>
          </div>

          {formOpen && (
            <div className="panel-body animate-in">
              {createError && (
                <div className="alert alert-error mb-2">⚠️ {createError}</div>
              )}

              <form onSubmit={handleCreateEvent}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="event-name">Event Name</label>
                    <input
                      id="event-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleFormChange}
                      placeholder="e.g. Tech Symposium 2026"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="event-date">Date</label>
                    <input
                      id="event-date"
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="event-venue">Venue</label>
                    <input
                      id="event-venue"
                      name="venue"
                      type="text"
                      value={form.venue}
                      onChange={handleFormChange}
                      placeholder="e.g. Main Auditorium"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="event-capacity">Max Capacity</label>
                    <input
                      id="event-capacity"
                      name="capacity"
                      type="number"
                      min="1"
                      value={form.capacity}
                      onChange={handleFormChange}
                      placeholder="e.g. 100"
                      required
                    />
                  </div>
                </div>
                <div className="flex-center" style={{ gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    id="create-event-btn"
                    type="submit"
                    className="btn btn-primary"
                    disabled={creating}
                  >
                    {creating ? 'Creating…' : 'Create Event'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setFormOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {createSuccess && (
          <div className="alert alert-success animate-in">{createSuccess}</div>
        )}

        {/* Events Table */}
        <h2 className="section-title">All Events</h2>

        {eventsLoading ? (
          <div className="spinner-wrap">
            <div className="spinner" />
            <span>Loading events…</span>
          </div>
        ) : eventsError ? (
          <div className="alert alert-error">⚠️ {eventsError}</div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗓️</div>
            <p>No events yet. Create the first one above.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Registrations</th>
                  <th>Capacity Fill</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => {
                  const pct =
                    event.capacity > 0
                      ? Math.round((event.registeredCount / event.capacity) * 100)
                      : 0;
                  const colorClass =
                    pct >= 80 ? 'red' : pct >= 50 ? 'amber' : 'green';

                  return (
                    <tr key={event._id}>
                      <td>
                        <strong>{event.name}</strong>
                      </td>
                      <td className="td-muted">
                        {new Date(event.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="td-muted">{event.venue}</td>
                      <td>
                        {event.registeredCount} / {event.capacity}
                      </td>
                      <td style={{ minWidth: '140px' }}>
                        <CapacityBar
                          registered={event.registeredCount}
                          capacity={event.capacity}
                        />
                      </td>
                      <td>
                        {event.isFull ? (
                          <span className="badge-full">Full</span>
                        ) : (
                          <span
                            style={{
                              color: `var(--${colorClass})`,
                              fontSize: '0.78rem',
                              fontWeight: 600,
                            }}
                          >
                            {pct}% filled
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() =>
                            router.push(`/admin/events/${event._id}`)
                          }
                          id={`view-regs-${event._id}`}
                        >
                          View Registrations
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
