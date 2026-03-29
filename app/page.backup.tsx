'use client';

import Link from 'next/link';

export default function HelpInABottleLanding() {
  return (
    <div className="hero-fullscreen">
      <div className="hero-background" />
      <div className="hero-overlay" />

      <main className="hero-content">
        <h1 className="title-premium">Help in a Bottle</h1>
        <p className="subtitle-premium">
          Connecting communities, one message at a time.
        </p>

        <div className="button-group">
          <Link href="/ask" className="btn-glass">
            Ask for Help
          </Link>

          <Link href="/share" className="btn-glass">
            Give Help
          </Link>
        </div>
      </main>

      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          width: '100%',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.4)',
          fontSize: '0.65rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          zIndex: 10,
          fontWeight: 300,
        }}
      >
        Lived Experience / Shared Wisdom / Human Connection
      </div>
    </div>
  );
}
