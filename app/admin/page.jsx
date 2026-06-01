'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CapacityBar from '@/components/CapacityBar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { apiFetch } from '@/lib/apiFetch';

export default function AdminPage() {
  console.log("insp-riverstone");
  return (
    <ProtectedRoute requiredRole="admin">
      {(user) => <AdminDashboard user={user} />}
    </ProtectedRoute>
  );
}

function AdminDashboard({ user }) {
  console.log("insp-riverstone");
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
  const [form, setForm] = useState({ name: '', date: '', venue: '', capacity: '' });

  // Edit event state
  const [editingEvent, setEditingEvent] = useState(null); // holds the event being edited
  const [editForm, setEditForm] = useState({ name: '', date: '', venue: '', capacity: '' });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Format date for <input type="date"> (YYYY-MM-DD)
  const toInputDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
  };

  const fetchEvents = useCallback(async () => {
    setEventsLoading(true);
    setEventsError('');
    try {
      const data = await apiFetch('/api/events');
      setEvents(data.events);
    } catch (err) {
      console.log("insp-err", err);
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

  function handleEditFormChange(e) {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // Open edit modal pre-filled with the selected event's current values
  function openEdit(event) {
    setEditingEvent(event);
    setEditForm({
      name:     event.name,
      date:     toInputDate(event.date),
      venue:    event.venue,
      capacity: String(event.capacity),
    });
    setEditError('');
    setEditSuccess('');
  }

  function closeEdit() {
    setEditingEvent(null);
    setEditError('');
    setEditSuccess('');
  }

  async function handleCreateEvent(e) {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    setCreateSuccess('');
    try {
      await apiFetch('/api/events', {
        method: 'POST',
        body: JSON.stringify({ ...form, capacity: Number(form.capacity) }),
      });
      setCreateSuccess(`Event "${form.name}" created successfully!`);
      setForm({ name: '', date: '', venue: '', capacity: '' });
      setFormOpen(false);
      fetchEvents();
    } catch (err) {
      console.log("insp-err", err);
      setCreateError(err.message || 'Failed to create event');
    } finally {
      setCreating(false);
    }
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    setSaving(true);
    setEditError('');
    setEditSuccess('');
    try {
      await apiFetch(`/api/events/${editingEvent._id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name:     editForm.name,
          date:     editForm.date,
          venue:    editForm.venue,
          capacity: Number(editForm.capacity),
        }),
      });
      setEditSuccess('Event updated successfully!');
      fetchEvents();
      // Close after short delay so user sees success
      setTimeout(() => closeEdit(), 1200);
    } catch (err) {
      console.log("insp-err", err);
      setEditError(err.message || 'Failed to update event');
    } finally {
      setSaving(false);
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
                    <input id="event-name" name="name" type="text" value={form.name}
                      onChange={handleFormChange} placeholder="e.g. Tech Symposium 2026" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="event-date">Date</label>
                    <input id="event-date" name="date" type="date" value={form.date}
                      onChange={handleFormChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="event-venue">Venue</label>
                    <input id="event-venue" name="venue" type="text" value={form.venue}
                      onChange={handleFormChange} placeholder="e.g. Main Auditorium" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="event-capacity">Max Capacity</label>
                    <input id="event-capacity" name="capacity" type="number" min="1"
                      value={form.capacity} onChange={handleFormChange} placeholder="e.g. 100" required />
                  </div>
                </div>
                <div className="flex-center" style={{ gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button id="create-event-btn" type="submit" className="btn btn-primary" disabled={creating}>
                    {creating ? 'Creating…' : 'Create Event'}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => setFormOpen(false)}>
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
                  const pct = event.capacity > 0
                    ? Math.round((event.registeredCount / event.capacity) * 100)
                    : 0;
                  const colorClass = pct >= 80 ? 'red' : pct >= 50 ? 'amber' : 'green';

                  return (
                    <tr key={event._id}>
                      <td><strong>{event.name}</strong></td>
                      <td className="td-muted">{formatDate(event.date)}</td>
                      <td className="td-muted">{event.venue}</td>
                      <td>{event.registeredCount} / {event.capacity}</td>
                      <td style={{ minWidth: '140px' }}>
                        <CapacityBar registered={event.registeredCount} capacity={event.capacity} />
                      </td>
                      <td>
                        {event.isFull ? (
                          <span className="badge-full">Full</span>
                        ) : (
                          <span style={{ color: `var(--${colorClass})`, fontSize: '0.78rem', fontWeight: 600 }}>
                            {pct}% filled
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => router.push(`/admin/events/${event._id}`)}
                            id={`view-regs-${event._id}`}
                          >
                            Registrations
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => openEdit(event)}
                            id={`edit-event-${event._id}`}
                          >
                            ✏️ Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Edit Event Modal */}
      {editingEvent && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200, padding: '1rem',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeEdit(); }}
        >
          <div
            className="card animate-in"
            style={{ width: '100%', maxWidth: '500px', boxShadow: 'var(--shadow-lg)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>✏️ Edit Event</h2>
              <button className="btn btn-ghost btn-sm" onClick={closeEdit}>✕ Close</button>
            </div>

            {editError   && <div className="alert alert-error mb-2">⚠️ {editError}</div>}
            {editSuccess && <div className="alert alert-success mb-2">✅ {editSuccess}</div>}

            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label htmlFor="edit-name">Event Name</label>
                <input id="edit-name" name="name" type="text"
                  value={editForm.name} onChange={handleEditFormChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-date">Date</label>
                  <input id="edit-date" name="date" type="date"
                    value={editForm.date} onChange={handleEditFormChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-capacity">Max Capacity</label>
                  <input id="edit-capacity" name="capacity" type="number" min="1"
                    value={editForm.capacity} onChange={handleEditFormChange} required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="edit-venue">Venue</label>
                <input id="edit-venue" name="venue" type="text"
                  value={editForm.venue} onChange={handleEditFormChange} required />
              </div>
              <div className="flex-center" style={{ gap: '0.75rem', marginTop: '0.75rem' }}>
                <button id="save-edit-btn" type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={closeEdit}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
