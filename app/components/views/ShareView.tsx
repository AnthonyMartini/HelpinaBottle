'use client';

import { useState } from 'react';

interface ShareViewProps {
  onBack: () => void;
}

export default function ShareView({ onBack }: ShareViewProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you for sharing your wisdom. Your experience will be matched with people in need.');
      onBack();
    }, 2000);
  };

  return (
    <main className="hero-content" style={{ marginTop: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '100vh', padding: '4rem 2rem' }}>
      <div className="glass-card fade-up-reveal" style={{ 
        maxWidth: '800px', 
        width: '100%', 
        background: 'rgba(255, 255, 255, 0.88)', 
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 40px 100px rgba(0, 0, 0, 0.18)',
        padding: '4rem 3.5rem',
        borderRadius: '40px',
        color: '#1a1a1a',
        textAlign: 'left',
        position: 'relative',
        zIndex: 20
      }}>
        <button 
          onClick={onBack}
          style={{ background: 'transparent', border: 'none', color: '#999', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500, marginBottom: '2rem' }}
        >
          ← Cancel
        </button>

        <h1 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '3.2rem', fontWeight: 500, marginBottom: '1rem', letterSpacing: '-0.02em', color: '#1a1a1a', lineHeight: 1.1 }}>
          Share your wisdom.
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.7, marginBottom: '3rem', lineHeight: 1.6, color: '#333', fontWeight: 300 }}>
          Your experience is a map for someone else who is lost. Describe a struggle you navigated and the breakthrough that helped you.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5 }}>The Breakthrough</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Finding the 'Caregiver Anchor'"
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.03)',
                border: '1px solid rgba(0,0,0,0.05)',
                borderRadius: '12px',
                color: '#1a1a1a',
                fontSize: '1.1rem',
                padding: '1.2rem',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5 }}>Your Story & Insight</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="How did you overcome it? What was the shift?..."
              style={{
                width: '100%',
                minHeight: '180px',
                background: 'rgba(0,0,0,0.03)',
                border: '1px solid rgba(0,0,0,0.05)',
                borderRadius: '12px',
                color: '#1a1a1a',
                fontSize: '1.1rem',
                padding: '1.2rem',
                outline: 'none',
                resize: 'none',
                fontFamily: 'inherit',
                lineHeight: '1.6'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5 }}>Key Themes</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., loneliness, resilience, mental health..."
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.03)',
                border: '1px solid rgba(0,0,0,0.05)',
                borderRadius: '12px',
                color: '#1a1a1a',
                fontSize: '1rem',
                padding: '1.2rem',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="btn-glass"
            style={{ 
              background: (!title.trim() || !content.trim()) ? 'rgba(0,0,0,0.05)' : '#1a1a1a', 
              color: (!title.trim() || !content.trim()) ? '#ccc' : 'white', 
              padding: '1.2rem', 
              fontSize: '1rem', 
              borderRadius: '50px', 
              marginTop: '1rem',
              letterSpacing: '0.1em',
              cursor: (!title.trim() || !content.trim()) ? 'not-allowed' : 'pointer',
              opacity: (!title.trim() || !content.trim()) ? 0.6 : 1
            }}
          >
            {isSubmitting ? 'Sharing...' : 'Cast Into the Sea'}
          </button>
        </form>
      </div>
    </main>
  );
}
