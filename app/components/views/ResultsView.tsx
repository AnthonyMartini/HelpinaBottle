'use client';

import { useEffect, useState } from 'react';

interface Bottle {
  id: string;
  text: string;
  createdAt?: string;
}

interface ResultsViewProps {
  query: string;
  onBack: () => void;
}

export default function ResultsView({ query, onBack }: ResultsViewProps) {
  const [matches, setMatches] = useState<Bottle[]>([]);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingStatus, setLoadingStatus] = useState('Connection with human stories...');

  // Cycle through loading messages
  useEffect(() => {
    if (!isLoading) return;
    const statuses = [
      'Connecting with human stories...',
      'Gathering wisdom from the sea...',
      'Sifting through the tides...',
      'Preparing your reflection...'
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % statuses.length;
      setLoadingStatus(statuses[i]);
    }, 1200);
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    async function fetchResults() {
      if (!query) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const response = await fetch('/api/cast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ struggleText: query }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'The ocean current is pulling us away. Please try again.');
        }

        const data = await response.json();
        setMatches(data.original_bottles || []);
        setSummary(data.ai_synthesis || 'We have gathered some wisdom for you.');
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
  }, [query]);

  if (isLoading) {
    return (
      <main className="hero-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100%' }}>
        <div className="glass-card fade-up-reveal" style={{ 
          maxWidth: '800px', 
          width: '100%', 
          background: 'rgba(255, 255, 255, 0.7)', 
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderRadius: '50px',
          padding: '6rem 4rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3rem',
          position: 'relative'
        }}>
          {/* Back Button (Top Left) */}
          <div style={{ position: 'absolute', top: '2rem', left: '2.5rem' }}>
            <button 
              onClick={onBack}
              style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500 }}
            >
              ← Back to Shore
            </button> 
          </div>

          <div className="floating-bottle">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8, filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.1))' }}>
              <path d="M9 5c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v2H9V5Z"/>
              <path d="M15 7v1c0 2 1 3 3 5v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-6c2-2 3-3 3-5V7"/>
              <path d="M12 11v5" strokeWidth="0.3" opacity="0.4"/>
            </svg>
          </div>
          <h2 key={loadingStatus} className="fade-up-reveal" style={{ 
            color: '#1a1a1a', 
            fontFamily: 'var(--font-serif, serif)', 
            fontSize: '2.8rem', 
            fontWeight: 300, 
            letterSpacing: '0.02em', 
            minHeight: '8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 0
          }}>
            {loadingStatus}
          </h2>
          <p style={{ color: 'rgba(0,0,0,0.4)', marginTop: '0.5rem', fontStyle: 'italic', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.8rem' }}>ALMOST THERE.</p>
        </div>
        <style jsx>{`
          .floating-bottle {
            animation: float 4s ease-in-out infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(-5deg); filter: drop-shadow(0 15px 15px rgba(0,0,0,0.05)); }
            50% { transform: translateY(-30px) rotate(10deg); filter: drop-shadow(0 40px 40px rgba(0,0,0,0.15)); }
          }
        `}</style>
      </main>
    );
  }

  if (error) {
    return (
      <main className="hero-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100%' }}>
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', background: 'rgba(255,255,255,0.9)', borderRadius: '30px' }}>
          <h2 style={{ color: '#d32f2f', fontSize: '2rem', marginBottom: '1.5rem' }}>Connection Lost</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2.5rem', opacity: 0.7 }}>{error}</p>
          <button onClick={onBack} className="btn-glass" style={{ background: '#1a1a1a', color: 'white', padding: '1rem 3rem', borderRadius: '50px' }}>
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="hero-content" style={{ marginTop: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '100vh', padding: '4rem 2rem' }}>
      <div className="glass-card fade-up-reveal scrollbox-minimal" style={{ 
        maxWidth: '1200px', 
        width: '95%', 
        maxHeight: '85vh',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        background: 'rgba(255, 255, 255, 0.7)', 
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 50px 150px rgba(0, 0, 0, 0.25)',
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
            ← Back to Shore
          </button>
        </div>

        {/* Header with Icon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', marginBottom: '3rem', animation: 'fade-up-reveal 1s ease-out' }}>
          <h1 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '3.8rem', fontWeight: 500, letterSpacing: '-0.03em', color: '#1a1a1a', lineHeight: 1.1, margin: 0 }}>
            A bottle found <span style={{ fontStyle: 'italic', fontWeight: 400 }}>in the sand.</span>
          </h1>
          <div style={{ animation: 'float 6s ease-in-out infinite' }}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
              <path d="M9 5c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v2H9V5Z"/>
              <path d="M15 7v1c0 2 1 3 3 5v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-6c2-2 3-3 3-5V7"/>
              <path d="M12 11v5" strokeWidth="0.3" opacity="0.4"/>
            </svg>
          </div>
        </div>
        
        {/* Synthesis Hub */}
        <section className="fade-up-reveal" style={{ 
          marginBottom: '5rem', 
          animationDelay: '0.2s', 
          background: 'rgba(0,0,0,0.03)', 
          padding: '3rem', 
          borderRadius: '30px',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.5rem', opacity: 0.4 }}>Echoes of Shared Survival</h2>
          <div style={{ fontSize: '1.4rem', lineHeight: 1.7, color: '#333', fontWeight: 300, fontFamily: 'var(--font-sans, sans-serif)' }}>
            {summary || 'Gleaning wisdom from the tides...'}
          </div>
        </section>

        {/* Stories Grid */}
        <section style={{ display: 'grid', gap: '3rem' }}>
          <div style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#666666', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              RECOVERED MESSAGES ({matches.length})
            </h2>
          </div>
          
          {matches.length === 0 ? (
            <p style={{ textAlign: 'center', fontSize: '1.2rem', opacity: 0.5, padding: '4rem 0' }}>The ocean is quiet today. No direct matches found, but the Guide's words remain.</p>
          ) : (
            matches.map((match, i) => (
              <div key={match.id} className="fade-up-reveal" style={{ 
                animationDelay: `${i * 0.2 + 0.4}s`,
                padding: '3.5rem',
                background: 'white',
                borderRadius: '35px',
                border: '1px solid rgba(0,0,0,0.04)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
                transition: 'transform 0.3s ease',
                position: 'relative'
              }}>
                <div style={{ marginBottom: '2rem' }}>
                   <div style={{ width: '40px', height: '2px', background: '#e0e0e0', marginBottom: '1.5rem' }}></div>
                   <p style={{ fontSize: '1.4rem', lineHeight: 1.8, color: '#333', fontWeight: 300, whiteSpace: 'pre-wrap' }}>
                    "{match.text}"
                  </p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                  <div style={{ width: '10px', height: '10px', background: 'rgba(0,0,0,0.1)', borderRadius: '50%' }}></div>
                  <span style={{ fontSize: '0.8rem', color: '#999', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {match.createdAt ? new Date(match.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Eternal Wisdom'}
                  </span>
                </div>
              </div>
            ))
          )}
        </section>

      </div>
      
      <style jsx>{`
        @keyframes fadeUpToast {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .glass-card {
          animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
