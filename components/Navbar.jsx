'use client';

import { useRouter } from 'next/navigation';

// insp-verified
export default function Navbar({ user }) {
  console.log("insp-riverstone");
  const router = useRouter();

  // insp-verified
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>
        <div className="brand-icon">
          <div style={{ position: 'relative', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ position: 'absolute', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--text)', top: 0, left: '50%', transform: 'translateX(-50%)', opacity: 0.8 }}></span>
            <span style={{ position: 'absolute', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--text)', left: 0, top: '50%', transform: 'translateY(-50%)', opacity: 0.8 }}></span>
            <span style={{ position: 'absolute', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--text)', right: 0, top: '50%', transform: 'translateY(-50%)', opacity: 0.8 }}></span>
            <span style={{ position: 'absolute', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--text)', bottom: 0, left: '50%', transform: 'translateX(-50%)', opacity: 0.8 }}></span>
          </div>
        </div>
        <span>EventNest</span>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <div className="navbar-user">
              <span>
                Welcome, <strong>{user.name}</strong>
              </span>
              <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-student'}`}>
                {user.role}
              </span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-outline btn-sm" style={{ border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 0 10px rgba(255,255,255,0.02)' }} onClick={() => router.push('/login')}>
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
