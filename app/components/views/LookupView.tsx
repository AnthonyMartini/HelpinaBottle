'use client';

import { useState } from 'react';

interface LookupViewProps {
  onBack: () => void;
}

export default function LookupView({ onBack }: LookupViewProps) {
  const [token, setToken] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = async () => {
    if (!token.trim()) return;
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/lookup?id=${token.trim()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Token not found.');
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="hero-content" style={{ marginTop: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100vh', padding: '1rem' }}>
      <div className="glass-card fade-up-reveal" style={{ 
        maxWidth: '700px', 
        width: '100%', 
        background: 'rgba(255, 255, 255, 0.7)', 
        backdropFilter: 'blur(45px)',
        WebkitBackdropFilter: 'blur(45px)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 50px 150px rgba(0, 0, 0, 0.2)',
        padding: '4rem 3rem',
        borderRadius: '40px',
        textAlign: 'center',
        color: '#1a1a1a',
        position: 'relative'
      }}>
        {/* Back Button */}
        <div style={{ position: 'absolute', top: '2rem', left: '2.5rem' }}>
          <button 
            onClick={onBack}
            style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500 }}
          >
            ← Back to Shore
          </button>
        </div>

        <h1 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '2.6rem', fontWeight: 500, marginBottom: '0.8rem', letterSpacing: '-0.02em' }}>
          Check Your <span style={{ fontStyle: 'italic' }}>Resonance.</span>
        </h1>
        <p style={{ fontSize: '0.9rem', opacity: 0.5, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '3rem' }}>Track the impact of your shared wisdom.</p>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(0,0,0,0.03)', borderRadius: '25px', padding: '0.5rem 0.5rem 0.5rem 1.5rem', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '1.5rem' }}>
          <input 
            autoFocus
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
            placeholder="Enter your Memory Token..."
            style={{ 
              flex: 1, 
              background: 'transparent', 
              border: 'none', 
              outline: 'none', 
              fontSize: '1.1rem', 
              color: '#1a1a1a', 
              fontWeight: 300,
              padding: '0.8rem 0'
            }}
          />
          <button 
            onClick={handleLookup}
            disabled={isLoading || !token.trim()}
            style={{ 
              background: '#1a1a1a', 
              color: 'white', 
              border: 'none', 
              borderRadius: '20px', 
              padding: '0.8rem 1.8rem', 
              fontSize: '0.85rem', 
              cursor: 'pointer',
              opacity: token.trim() ? 1 : 0.4
            }}
          >
            {isLoading ? '...' : 'Track'}
          </button>
        </div>

        {error && <p style={{ color: '#d32f2f', fontSize: '0.9rem', marginTop: '1rem' }}>{error}</p>}

        {result && (
          <div className="fade-up-reveal" style={{ marginTop: '3rem', textAlign: 'left', background: 'white', padding: '2.5rem', borderRadius: '30px', boxShadow: '0 15px 45px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <h3 style={{ fontSize: '0.7rem', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.2rem' }}>YOUR MESSAGE</h3>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ff6b6b' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{result.likes || 0} Repersonances</span>
               </div>
            </div>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 300, color: '#333', fontStyle: 'italic' }}>
              "{result.text}"
            </p>
            <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', opacity: 0.3 }}>Cast on {new Date(result.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </main>
  );
}
