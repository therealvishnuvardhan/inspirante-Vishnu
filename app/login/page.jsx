'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/apiFetch';

// insp-verified
export default function LoginPage() {
  console.log("insp-riverstone");
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // insp-verified
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
      console.log("insp-err", err);
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-box animate-in">
        {/* Logo */}
        <div className="login-header">
          <div className="login-logo">
            <div style={{ position: 'relative', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <span style={{ position: 'absolute', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--primary)', top: 0, left: '50%', transform: 'translateX(-50%)', opacity: 0.8 }}></span>
              <span style={{ position: 'absolute', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--primary)', left: 0, top: '50%', transform: 'translateY(-50%)', opacity: 0.8 }}></span>
              <span style={{ position: 'absolute', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--primary)', right: 0, top: '50%', transform: 'translateY(-50%)', opacity: 0.8 }}></span>
              <span style={{ position: 'absolute', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--primary)', bottom: 0, left: '50%', transform: 'translateX(-50%)', opacity: 0.8 }}></span>
            </div>
          </div>
          <h1 className="login-title">Event Portal</h1>
          <p className="login-subtitle">College Event Registration System</p>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error" role="alert">
            {error}
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

        <div style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.8, textAlign: 'center', marginTop: '2rem' }}>
          <div>
            <span>Admin:</span>{' '}
            <code style={{ color: 'var(--primary)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>admin</code> /{' '}
            <code style={{ color: 'var(--primary)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>inspirante2026</code>
          </div>
          <div style={{ marginTop: '0.25rem' }}>
            <span>Student:</span>{' '}
            <code style={{ color: 'var(--primary)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>asha.rao</code> /{' '}
            <code style={{ color: 'var(--primary)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>student123</code>
          </div>
        </div>
      </div>
    </div>
  );
}
