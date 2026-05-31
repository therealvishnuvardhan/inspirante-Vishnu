'use client';

import { useRouter } from 'next/navigation';

export default function Navbar({ user }) {
  console.log("insp-riverstone");
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">🎓</div>
        <span>Event Portal</span>
      </div>

      <div className="navbar-right">
        {user && (
          <div className="navbar-user">
            <span>
              Welcome, <strong>{user.name}</strong>
            </span>
            <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-student'}`}>
              {user.role}
            </span>
          </div>
        )}
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
