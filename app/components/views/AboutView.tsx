'use client';

interface AboutViewProps {
  onBack: () => void;
}

export default function AboutView({ onBack }: AboutViewProps) {
  return (
    <main className="hero-content" style={{ marginTop: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '100vh', padding: '4rem 2rem' }}>
      <div className="glass-card fade-up-reveal" style={{ 
        maxWidth: '800px', 
        width: '100%', 
        background: 'rgba(255, 255, 255, 0.92)', 
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 50px 120px rgba(0, 0, 0, 0.2)',
        padding: '5rem 4rem',
        borderRadius: '50px',
        color: '#1a1a1a',
        textAlign: 'left',
        position: 'relative',
        zIndex: 20
      }}>
        <button 
          onClick={onBack}
          style={{ background: 'transparent', border: 'none', color: '#999', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500, marginBottom: '3rem' }}
        >
          ← Back
        </button>

        <h1 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '3.8rem', fontWeight: 500, marginBottom: '2.5rem', letterSpacing: '-0.03em', color: '#1a1a1a', lineHeight: 1.1 }}>
          About Help in a Bottle
        </h1>
        
        <div style={{ fontSize: '1.2rem', lineHeight: 1.8, color: '#444', fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 300 }}>
          <p style={{ marginBottom: '2rem' }}>
            We live in a world overflowing with information, yet starve for wisdom. "Help in a Bottle" was born from the belief that the most profound solutions to our struggles are often held by those who have walked the path before us.
          </p>
          <p style={{ marginBottom: '2rem' }}>
            Inspired by the timeless image of a message cast into the sea, our platform is a sanctuary for lived experience. It is a place where you can share your journey, your breakthroughs, and your maps—or reach out to find one when you are lost.
          </p>
          <p style={{ marginBottom: '2rem' }}>
            By connecting individuals through their shared human experience, we bridge the gap between isolation and community. Every message is a bottle thrown into the digital ocean, destined to find the person who needs its wisdom most.
          </p>
          <p style={{ fontStyle: 'italic', marginTop: '5rem', color: '#999', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
            Connecting communities, one message at a time.
          </p>
        </div>
      </div>
    </main>
  );
}
