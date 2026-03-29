'use client';

import { useState } from 'react';

interface AskViewProps {
  onBack: () => void;
  onResults: (query: string) => void;
}

export default function AskView({ onBack, onResults }: AskViewProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  const handleFindWisdom = () => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    setStatus('Understanding your struggle...');
    setTimeout(() => setStatus('Connecting with human stories...'), 1500);
    setTimeout(() => {
      onResults(content);
    }, 3500);
  };

  const isValid = content.trim().length > 10;

  return (
    <main className="hero-content" style={{ marginTop: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100vh', padding: '2rem' }}>
      <div className="glass-card" style={{ 
        maxWidth: '800px', 
        width: '100%', 
        background: 'rgba(255, 255, 255, 0.88)', 
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 40px 100px rgba(0, 0, 0, 0.18)',
        padding: '5rem 3.5rem',
        borderRadius: '40px',
        color: '#1a1a1a',
        textAlign: 'center',
        position: 'relative',
        zIndex: 20
      }}>
        {!isSubmitting ? (
          <div className="fade-up-reveal">
            {/* Suitable "Bottle" / "Message" Icon */}
            <div style={{ marginBottom: '2.5rem', color: '#1a1a1a', opacity: 0.9 }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                <path d="M9 5c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v2H9V5Z"/>
                <path d="M15 7v1c0 2 1 3 3 5v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-6c2-2 3-3 3-5V7"/>
                <path d="M10 14h4"/>
                <path d="M10 17h4"/>
              </svg>
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '3.5rem', fontWeight: 500, marginBottom: '1.2rem', letterSpacing: '-0.02em', color: '#1a1a1a', lineHeight: 1.1 }}>
              How can we help?
            </h1>
            <p style={{ fontSize: '1.1rem', opacity: 0.7, marginBottom: '3.5rem', lineHeight: 1.6, color: '#333', fontWeight: 300, maxWidth: '500px', margin: '0 auto 3.5rem' }}>
              Share what's on your mind. We'll find the wisdom of someone who has walked this path before you.
            </p>
            
            <div className="vessel-input" style={{ width: '100%', marginBottom: '3rem' }}>
              <textarea
                autoFocus
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Speak your heart... What are you navigating?"
                style={{
                  width: '100%',
                  minHeight: '130px',
                  background: 'transparent',
                  border: 'none',
                  color: '#1a1a1a',
                  fontSize: '1.4rem',
                  padding: '1rem',
                  outline: 'none',
                  textAlign: 'center',
                  fontFamily: 'inherit',
                  resize: 'none',
                  fontWeight: 300,
                  lineHeight: 1.5
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center' }}>
              <button 
                onClick={onBack}
                style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500 }}
              >
                ← Back
              </button>
              
              <button 
                onClick={handleFindWisdom} 
                className="btn-glass"
                disabled={!isValid}
                style={{ 
                  background: isValid ? '#1a1a1a' : 'rgba(0,0,0,0.05)', 
                  color: isValid ? 'white' : '#ccc', 
                  padding: '1rem 3.5rem', 
                  borderRadius: '50px', 
                  fontSize: '0.9rem', 
                  letterSpacing: '0.1em',
                  cursor: isValid ? 'pointer' : 'not-allowed',
                  opacity: isValid ? 1 : 0.6
                }}
              >
                Find Wisdom
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>
            <div className="wave-container" style={{ opacity: 0.6, height: '40px' }}>
              {[...Array(12)].map((_, i) => (
                <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s`, height: '10px', background: '#1a1a1a', width: '3px', margin: '0 3px' }}></div>
              ))}
            </div>
            
            <h2 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '2.4rem', color: '#1a1a1a', fontWeight: 400, letterSpacing: '-0.01em' }}>
              {status}
            </h2>
            
            <p style={{ opacity: 0.4, fontStyle: 'italic' }}>Reaching out to the digital ocean...</p>
          </div>
        )}
      </div>
    </main>
  );
}
