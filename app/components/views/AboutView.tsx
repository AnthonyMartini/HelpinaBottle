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
        maxHeight: '85vh',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        background: 'rgba(255, 255, 255, 0.7)', 
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
        {/* Back Button (Top Left) */}
        <div style={{ position: 'absolute', top: '2rem', left: '2.5rem' }}>
          <button 
            onClick={onBack}
            style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500 }}
          >
            ← Back to Coast
          </button>
        </div>

        <h1 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '3.8rem', fontWeight: 500, marginBottom: '2.5rem', letterSpacing: '-0.03em', color: '#1a1a1a', lineHeight: 1.1, marginTop: '2rem' }}>
          About Help in a Bottle
        </h1>
        
        <div style={{ fontSize: '1.2rem', lineHeight: 1.8, color: '#444', fontFamily: 'var(--font-sans, sans-serif)', fontWeight: 300 }}>
          <p style={{ marginBottom: '2rem' }}>
            We live in a world overflowing with information, yet starve for wisdom. "Help in a Bottle" was born from the belief that the most profound solutions to our struggles are often held by those who have walked the path before us.
          </p>
          <p style={{ marginBottom: '2rem' }}>
            Inspired by the timeless image of a message cast into the sea, our platform is a sanctuary for lived experience. It is a place where you can share your journey, your breakthroughs, and your maps—or reach out to find one when you are lost.
          </p>
          <p style={{ marginBottom: '4rem' }}>
            By connecting individuals through their shared human experience, we bridge the gap between isolation and community. Every message is a bottle thrown into the digital ocean, destined to find the person who needs its wisdom most.
          </p>

          <div style={{ padding: '2.5rem', background: 'rgba(0,0,0,0.03)', borderRadius: '25px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.5rem', opacity: 0.4 }}>The Technical Heart</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI-Powered Empathy</p>
                <p style={{ fontSize: '0.95rem', opacity: 0.7, lineHeight: 1.6 }}>
                  Built with <strong>Gemini 3.1 Flash Lite</strong>, our therapeutic guides validate your experience and help you find clarity before you cast your message.
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Semantic Resonance</p>
                <p style={{ fontSize: '0.95rem', opacity: 0.7, lineHeight: 1.6 }}>
                  Using advanced <strong>vector embeddings</strong>, we match your feelings not just by words, but by the deeper human meaning behind them.
                </p>
              </div>
            </div>
          </div>
          <p style={{ fontStyle: 'italic', marginTop: '5rem', color: '#999', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
            Connecting communities, one message at a time.
          </p>
        </div>
      </div>
    </main>
  );
}
