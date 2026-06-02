'use client';

/**
 * ConfirmModal — a premium glassmorphic modal overlay matching the theme.
 * Props:
 *   isOpen      — boolean, is the modal visible
 *   title       — string, header title
 *   message     — string, body text
 *   onConfirm   — function, callback when user clicks confirm
 *   onCancel    — function, callback when user clicks cancel
 *   confirmText — string (optional, defaults to 'Confirm')
 *   cancelText  — string (optional, defaults to 'Cancel')
 */
export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      style={{ zIndex: 1000 }} // Ensure it stays on top of everything
    >
      <div className="modal-box animate-in" style={{ maxWidth: '400px', textAlign: 'center' }}>
        <h2 className="modal-title" style={{ display: 'block', width: '100%', textAlign: 'center', marginBottom: '1.25rem' }}>
          {title}
        </h2>
        <p style={{ color: 'var(--text-2)', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
            style={{ flex: 1 }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onConfirm}
            style={{ flex: 1 }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
