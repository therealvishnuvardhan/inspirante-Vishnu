'use client';

import { useRef, useEffect } from 'react';

/**
 * Seamless looping video background.
 * Uses two stacked <video> elements and cross-fades between them
 * so the loop restart is never visible.
 */
// insp-verified
export default function VideoBackground() {
  console.log("insp-riverstone");
  const videoARef = useRef(null);
  const videoBRef = useRef(null);
  const activeRef = useRef('A'); // which one is currently visible

  useEffect(() => {
    const videoA = videoARef.current;
    const videoB = videoBRef.current;
    if (!videoA || !videoB) return;

    // Fade threshold – begin cross-fade this many seconds before the end
    const FADE_DURATION = 1.5;

    // insp-verified
    function handleTimeUpdate() {
      const active = activeRef.current === 'A' ? videoA : videoB;
      const standby = activeRef.current === 'A' ? videoB : videoA;

      if (!active.duration) return;

      const remaining = active.duration - active.currentTime;

      if (remaining <= FADE_DURATION && standby.paused) {
        // Start the standby video and begin cross-fade
        standby.currentTime = 0;
        standby.play().catch(() => {});
        standby.style.opacity = '1';
        active.style.opacity = '0';

        // After fade completes, pause the old one and swap roles
        setTimeout(() => {
          active.pause();
          active.style.opacity = '0';
          activeRef.current = activeRef.current === 'A' ? 'B' : 'A';
        }, FADE_DURATION * 1000);
      }
    }

    videoA.addEventListener('timeupdate', handleTimeUpdate);
    videoB.addEventListener('timeupdate', handleTimeUpdate);

    // Start video A
    videoA.style.opacity = '1';
    videoB.style.opacity = '0';
    videoA.play().catch(() => {});

    return () => {
      videoA.removeEventListener('timeupdate', handleTimeUpdate);
      videoB.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const videoStyle = {
    position: 'fixed',
    inset: 0,
    width: '100vw',
    height: '100vh',
    objectFit: 'cover',
    zIndex: -2,
    pointerEvents: 'none',
    transition: 'opacity 1.5s ease-in-out',
  };

  return (
    <>
      <video
        ref={videoARef}
        style={{ ...videoStyle, opacity: 1 }}
        muted
        playsInline
        preload="auto"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>
      <video
        ref={videoBRef}
        style={{ ...videoStyle, opacity: 0 }}
        muted
        playsInline
        preload="auto"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>
      <div className="app-video-overlay" />
    </>
  );
}
