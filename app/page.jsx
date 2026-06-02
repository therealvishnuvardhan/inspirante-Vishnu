'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

// insp-verified
export default function Home() {
  console.log("insp-riverstone");
  const router = useRouter();

  return (
    <div className="landing-wrapper">
      {/* Top Floating Navbar */}
      <Navbar user={null} />

      {/* Main Content Area */}
      <div className="landing-content">
        <div className="hero-text animate-in">
          <h1 className="hero-title">
            Accelerate your
            <br />
            event registrations
          </h1>
          <p className="hero-subtitle">
            Trusted by campus organizations, we solve registration challenges and
            boost student engagement through sleek, modern event management systems.
          </p>
          <div className="hero-ctas">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => router.push('/login')}
            >
              Get Started →
            </button>
            <button
              className="btn btn-ghost btn-lg"
              onClick={() => {
                const el = document.getElementById('about');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn more
            </button>
          </div>
        </div>

        <div id="about" style={{ marginTop: '8rem', scrollMarginTop: '100px' }} className="animate-in">
          <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', textAlign: 'center' }}>About EventNest</h2>
          <p style={{ fontSize: '1.15rem', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '800px', margin: '0 auto 3rem', textAlign: 'center', lineHeight: 1.6 }}>
            EventNest is the ultimate hub for campus activities. We bridge the gap between eager student participants and event organizers through an intuitive, visual, and highly responsive management platform.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', padding: '2rem', borderRadius: 'var(--radius-lg)', backdropFilter: 'blur(20px)' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>Seamless Registrations</h3>
              <p style={{ color: 'var(--text-2)', fontSize: '0.92rem', lineHeight: 1.6 }}>Sign up for technical symposiums and non-technical workshops with a single click. Immediate confirmation and entry badges are generated automatically.</p>
            </div>
            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', padding: '2rem', borderRadius: 'var(--radius-lg)', backdropFilter: 'blur(20px)' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>Organizers Dashboard</h3>
              <p style={{ color: 'var(--text-2)', fontSize: '0.92rem', lineHeight: 1.6 }}>Create, monitor, and update events in real-time. Admins can upload custom local flyers, manage maximum seat capacities, and view registration spreadsheets.</p>
            </div>
            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', padding: '2rem', borderRadius: 'var(--radius-lg)', backdropFilter: 'blur(20px)' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>Live Performance Indicators</h3>
              <p style={{ color: 'var(--text-2)', fontSize: '0.92rem', lineHeight: 1.6 }}>Track registration fill levels instantly with real-time visual capacity indicators. Spot high-demand events at a single glance.</p>
            </div>
          </div>

          <div className="landing-stats" style={{ justifyContent: 'center', gap: '5rem', marginTop: '2rem' }}>
            <div className="stat-item" style={{ textAlign: 'center' }}>
              <div className="stat-num">40+</div>
              <div className="stat-desc">Campus events organized</div>
            </div>
            <div className="stat-item" style={{ textAlign: 'center' }}>
              <div className="stat-num">3K+</div>
              <div className="stat-desc">Registrations processed</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          marginTop: '6rem',
          padding: '2.5rem 1rem 1.5rem',
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--text-3)'
        }}>
          <p>© 2026 EventNest. All rights reserved. Connecting campus events and students seamlessly.</p>
        </footer>
      </div>
    </div>
  );
}
