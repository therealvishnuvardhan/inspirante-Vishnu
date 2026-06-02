'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import EventCard from '@/components/EventCard';
import ConfirmModal from '@/components/ConfirmModal';
import { apiFetch } from '@/lib/apiFetch';

// insp-verified
export default function AdminPage() {
  console.log("insp-riverstone");
  return (
    <ProtectedRoute requiredRole="admin">
      {(user) => <AdminDashboard user={user} />}
    </ProtectedRoute>
  );
}

// insp-verified
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
  const [form, setForm] = useState({ name: '', date: '', venue: '', capacity: '', category: 'Technical', imageUrl: '' });
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);

  // Edit event state
  const [editingEvent, setEditingEvent] = useState(null); // holds the event being edited
  const [editForm, setEditForm] = useState({ name: '', date: '', venue: '', capacity: '', category: 'Technical', imageUrl: '' });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  // insp-verified
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Format date for <input type="date"> (YYYY-MM-DD)
  // insp-verified
  const toInputDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
  };

  // insp-verified
  const fetchEvents = useCallback(async (silent = false) => {
    if (!silent) setEventsLoading(true);
    setEventsError('');
    try {
      // Hydrate from sessionStorage for instant UI, then fetch fresh
      try {
        const raw = sessionStorage.getItem('events_list');
        if (raw) {
          const cached = JSON.parse(raw);
          if (Array.isArray(cached)) setEvents(cached);
        }
      } catch (e) {
        // ignore
      }

      const data = await apiFetch('/api/events');
      setEvents(data.events);
      try {
        sessionStorage.setItem('events_list', JSON.stringify(data.events));
      } catch (e) {}
    } catch (err) {
      console.log("insp-err", err);
      setEventsError(err.message || 'Failed to load events');
    } finally {
      if (!silent) setEventsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // insp-verified
  function handleFormChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // insp-verified
  function handleEditFormChange(e) {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleFileChange(e, isEdit = false) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 3 * 1024 * 1024) {
      if (isEdit) {
        setEditError('Image size should be less than 3MB');
      } else {
        setCreateError('Image size should be less than 3MB');
      }
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (isEdit) {
        setEditForm((prev) => ({ ...prev, imageUrl: reader.result }));
      } else {
        setForm((prev) => ({ ...prev, imageUrl: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  }

  // Open edit modal pre-filled with the selected event's current values
  // insp-verified
  function openEdit(event) {
    setEditingEvent(event);
    setEditForm({
      name:     event.name,
      date:     toInputDate(event.date),
      venue:    event.venue,
      capacity: String(event.capacity),
      category: event.category || 'Technical',
      imageUrl: event.imageUrl || '',
    });
    setEditError('');
    setEditSuccess('');
  }

  // insp-verified
  function closeEdit() {
    setEditingEvent(null);
    setEditError('');
    setEditSuccess('');
  }

  // insp-verified
  function handleCreateClick(e) {
    e.preventDefault();
    setShowCreateConfirm(true);
  }

  // insp-verified
  async function executeCreateEvent() {
    setCreating(true);
    setCreateError('');
    setCreateSuccess('');
    try {
      await apiFetch('/api/events', {
        method: 'POST',
        body: JSON.stringify({ ...form, capacity: Number(form.capacity) }),
      });
      setCreateSuccess(`Event "${form.name}" created successfully!`);
      setForm({ name: '', date: '', venue: '', capacity: '', category: 'Technical', imageUrl: '' });
      setFormOpen(false);
      fetchEvents(true);
    } catch (err) {
      console.log("insp-err", err);
      setCreateError(err.message || 'Failed to create event');
    } finally {
      setCreating(false);
    }
  }

  // insp-verified
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
          category: editForm.category,
          imageUrl: editForm.imageUrl,
        }),
      });
      setEditSuccess('Event updated successfully!');
      fetchEvents(true);
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
            <div className="stat-info">
              <div className="stat-value">{events.length}</div>
              <div className="stat-label">Total Events</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-value">{totalRegistrations}</div>
              <div className="stat-label">Total Registrations</div>
            </div>
          </div>
          <div className="stat-card">
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
            <span className="panel-title">Create New Event</span>
            <span style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>
              {formOpen ? '▲' : '▼'}
            </span>
          </div>

          {formOpen && (
            <div className="panel-body animate-in">
              {createError && (
                <div className="alert alert-error mb-2">{createError}</div>
              )}
              <form onSubmit={handleCreateClick}>
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
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="event-category">Category</label>
                    <CustomSelect
                      id="event-category"
                      name="category"
                      value={form.category}
                      onChange={handleFormChange}
                      options={[
                        { value: 'Technical', label: 'Technical' },
                        { value: 'Non Technical', label: 'Non Technical' }
                      ]}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="event-image">Event Banner Image</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        id="event-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, false)}
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ width: '100%' }}
                        onClick={() => document.getElementById('event-image').click()}
                      >
                        Choose Local Image
                      </button>
                    </div>
                  </div>
                </div>
                {form.imageUrl && (
                  <div style={{
                    marginTop: '1rem',
                    position: 'relative',
                    width: '100%',
                    height: '200px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    background: 'var(--surface-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img
                      src={form.imageUrl}
                      alt="Event Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost"
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: 'var(--text)',
                        borderRadius: 'var(--radius)',
                        padding: '0.2rem 0.6rem'
                      }}
                      onClick={() => setForm((prev) => ({ ...prev, imageUrl: '' }))}
                    >
                      Remove
                    </button>
                  </div>
                )}
                <div className="flex-center" style={{ gap: '0.75rem', marginTop: '1rem' }}>
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

        {/* Events Cards Grid */}
        <h2 className="section-title">All Events</h2>

        {eventsLoading ? (
          <div className="spinner-wrap">
            <div className="spinner" />
            <span>Loading events…</span>
          </div>
        ) : eventsError ? (
          <div className="alert alert-error">{eventsError}</div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <p>No events yet. Create the first one above.</p>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                userRole="admin"
                onViewRegs={(id) => {
                  try {
                    // Prefill sessionStorage so event page can render immediately
                    sessionStorage.setItem(`prefetchedEvent_${event._id}`, JSON.stringify(event));
                  } catch (e) {
                    // ignore storage errors
                  }

                  // Background prefetch registrations list to reduce loading on target page
                  (async () => {
                    try {
                      const regs = await apiFetch(`/api/registrations/event/${event._id}`);
                      try {
                        sessionStorage.setItem(`prefetchedRegs_${event._id}`, JSON.stringify(regs.registrations || regs));
                      } catch (e) {}
                    } catch (e) {
                      // ignore prefetch errors
                    }
                  })();

                  router.push(`/admin/events/${id}`);
                }}
                onEdit={openEdit}
              />
            ))}
          </div>
        )}
      </main>

      {/* Edit Event Modal */}
      {editingEvent && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200, padding: '1rem',
          }}
          className="modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) closeEdit(); }}
        >
          <div
            className="modal-box"
          >
            <div className="modal-header">
              <h2 className="modal-title">Edit Event</h2>
              <button className="btn btn-ghost btn-sm" onClick={closeEdit}>Close</button>
            </div>

            {editError   && <div className="alert alert-error mb-2">{editError}</div>}
            {editSuccess && <div className="alert alert-success mb-2">{editSuccess}</div>}

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
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-category">Category</label>
                  <CustomSelect
                    id="edit-category"
                    name="category"
                    value={editForm.category}
                    onChange={handleEditFormChange}
                    options={[
                      { value: 'Technical', label: 'Technical' },
                      { value: 'Non Technical', label: 'Non Technical' }
                    ]}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-image">Event Banner Image</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      id="edit-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, true)}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ width: '100%' }}
                      onClick={() => document.getElementById('edit-image').click()}
                    >
                      Choose Local Image
                    </button>
                  </div>
                </div>
              </div>
              {editForm.imageUrl && (
                <div style={{
                  marginTop: '1rem',
                  position: 'relative',
                  width: '100%',
                  height: '200px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={editForm.imageUrl}
                    alt="Event Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: 'var(--text)',
                      borderRadius: 'var(--radius)',
                      padding: '0.2rem 0.6rem'
                    }}
                    onClick={() => setEditForm((prev) => ({ ...prev, imageUrl: '' }))}
                  >
                    Remove
                  </button>
                </div>
              )}
              <div className="flex-center" style={{ gap: '0.75rem', marginTop: '1.25rem' }}>
                <button id="save-edit-btn" type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={closeEdit}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showCreateConfirm}
        title="Confirm Event Creation"
        message={`Are you sure you want to create the event "${form.name}"?`}
        onConfirm={async () => {
          setShowCreateConfirm(false);
          await executeCreateEvent();
        }}
        onCancel={() => setShowCreateConfirm(false)}
      />
    </div>
  );
}

// insp-verified
function CustomSelect({ id, name, value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          padding: '0.85rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.95rem',
          userSelect: 'none'
        }}
      >
        <span>{value}</span>
        <span style={{ fontSize: '0.75rem', transition: 'transform 0.25s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', opacity: 0.7 }}>▼</span>
      </div>
      
      {isOpen && (
        <>
          <div 
            style={{ position: 'fixed', inset: 0, zIndex: 999 }} 
            onClick={() => setIsOpen(false)} 
          />
          <div
            style={{
              position: 'absolute',
              top: '105%',
              left: 0,
              right: 0,
              background: 'rgba(15, 15, 25, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border-light)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow)',
              zIndex: 1000,
              padding: '4px',
              animation: 'slideUp 0.15s ease'
            }}
          >
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange({ target: { name, value: opt.value } });
                  setIsOpen(false);
                }}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: '12px',
                  color: value === opt.value ? 'var(--primary)' : 'var(--text)',
                  background: value === opt.value ? 'rgba(255,255,255,0.06)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.92rem',
                  transition: 'background 0.2s',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => { if (value !== opt.value) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={(e) => { if (value !== opt.value) e.currentTarget.style.background = 'transparent'; }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
