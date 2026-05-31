'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/apiFetch';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/student');
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-box animate-in">
        {/* Logo */}
        <div className="login-logo">
          <div className="logo-icon">🎓</div>
          <div>
            <h1>Event Portal</h1>
            <p>College Event Registration System</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin or asha.rao"
              required
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="form-group mb-2">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            id="login-btn"
            type="submit"
            className="btn btn-primary btn-full btn-lg mt-2"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="login-divider mt-2">quick access credentials</div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', lineHeight: 1.8 }}>
          <div>
            <strong style={{ color: 'var(--text-2)' }}>Admin:</strong>{' '}
            <code style={{ color: 'var(--primary)' }}>admin</code> /{' '}
            <code style={{ color: 'var(--primary)' }}>inspirante2026</code>
          </div>
          <div>
            <strong style={{ color: 'var(--text-2)' }}>Student:</strong>{' '}
            <code style={{ color: 'var(--primary)' }}>asha.rao</code> /{' '}
            <code style={{ color: 'var(--primary)' }}>student123</code>
          </div>
        </div>
      </div>
    </div>
  );
}
