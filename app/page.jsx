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

        <div id="about" className="landing-stats animate-in" style={{ animationDelay: '0.15s' }}>
          <div className="stat-item">
            <div className="stat-num">40+</div>
            <div className="stat-desc">Campus events organized</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">3K+</div>
            <div className="stat-desc">Registrations processed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
