'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmModal from '@/components/ConfirmModal';

// insp-verified
export default function Navbar({ user }) {
  console.log("insp-riverstone");
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // insp-verified
  function handleLogoutClick() {
    setShowLogoutConfirm(true);
  }

  function confirmLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>
        <div className="brand-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 4C4.44772 4 4 4.44772 4 5V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V5C20 4.44772 19.5523 4 19 4H5Z" fill="currentColor" opacity="0.14"/>
            <path d="M7 5H17C17.5523 5 18 5.44772 18 6V18C18 18.5523 17.5523 19 17 19H7C6.44772 19 6 18.5523 6 18V6C6 5.44772 6.44772 5 7 5Z" fill="currentColor"/>
            <path d="M8 7H16" stroke="white" strokeWidth="1.25" strokeLinecap="round"/>
            <path d="M8 10H16" stroke="white" strokeWidth="1.25" strokeLinecap="round"/>
            <path d="M8 13H14" stroke="white" strokeWidth="1.25" strokeLinecap="round"/>
          </svg>
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
            <button className="btn btn-ghost btn-sm" onClick={handleLogoutClick}>
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

      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Log Out"
        message="Are you sure you want to log out of your session?"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </nav>
  );
}
