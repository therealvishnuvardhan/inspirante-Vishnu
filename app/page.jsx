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

        <div id="about" className="about-section animate-in">
          <h2 className="about-title">About EventNest</h2>
          <p className="about-desc">
            EventNest is the ultimate hub for campus activities. We bridge the gap between eager student participants and event organizers through an intuitive, visual, and highly responsive management platform.
          </p>

          <div className="about-grid">
            <div className="about-card">
              <h3>Seamless Registrations</h3>
              <p>Sign up for technical symposiums and non-technical workshops with a single click. Immediate confirmation and entry badges are generated automatically.</p>
            </div>
            <div className="about-card">
              <h3>Organizers Dashboard</h3>
              <p>Create, monitor, and update events in real-time. Admins can upload custom local flyers, manage maximum seat capacities, and view registration spreadsheets.</p>
            </div>
            <div className="about-card">
              <h3>Live Performance Indicators</h3>
              <p>Track registration fill levels instantly with real-time visual capacity indicators. Spot high-demand events at a single glance.</p>
            </div>
          </div>

          <div className="landing-stats">
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

          {/* Footer placed outside landing-content for full-bleed background */}
      </div>
        <footer className="site-footer">
          <p>© 2026 EventNest. All rights reserved. Connecting campus events and students seamlessly.</p>
        </footer>
    </div>
  );
}
