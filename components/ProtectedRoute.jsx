'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * ProtectedRoute — client-side auth guard.
 * Checks localStorage for a valid token + matching role.
 * Redirects to /login if unauthenticated, or shows 403 if wrong role.
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const router = useRouter();
  const [status, setStatus] = useState('checking'); // 'checking' | 'ok' | 'forbidden'
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('user');

    if (!token || !stored) {
      router.replace('/login');
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (requiredRole && parsed.role !== requiredRole) {
        setStatus('forbidden');
        return;
      }
      setUser(parsed);
      setStatus('ok');
    } catch {
      router.replace('/login');
    }
  }, [router, requiredRole]);

  if (status === 'checking') {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
        <span>Loading...</span>
      </div>
    );
  }

  if (status === 'forbidden') {
    return (
      <div className="spinner-wrap">
        <p style={{ color: 'var(--red)', fontSize: '1rem' }}>
          ⛔ Access denied. You do not have permission to view this page.
        </p>
        <button className="btn btn-ghost btn-sm" onClick={() => router.replace('/login')}>
          Back to Login
        </button>
      </div>
    );
  }

  return children(user);
}
