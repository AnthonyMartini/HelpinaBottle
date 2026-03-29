'use client';

import { useEffect, useState } from 'react';

interface ResultsViewProps {
  query: string;
  onBack: () => void;
}

const MOCK_SOLUTIONS = [
  {
    id: '1',
    title: 'Finding the "Caregiver Anchor"',
    content: "When my father was sick, I felt like I was drowning in daily tasks. The solution I found wasn't doing more—it was finding one 30-minute 'anchor' every day where I was NOT a caregiver. For me, it was 6 AM coffee with a book. No phone, no lists. It saved my sanity.",
    tags: ['caregiver exhaustion', 'loneliness'],
    author: 'Sarah M.',
    matchReason: 'This matches your feeling of being overwhelmed by care responsibilities.'
  },
  {
    id: '2',
    title: 'The "Friendship Queue"',
    content: "Chronic illness made me isolated. I felt too tired to reach out. I started a 'Friendship Queue'—one text a day to one person, just saying 'Thinking of you'. I didn't ask for anything. Within a month, my circle felt alive again without me feeling drained.",
    tags: ['loneliness', 'disability'],
    author: 'David L.',
    matchReason: 'This matches your mention of isolation and social fatigue.'
  },
  {
    id: '3',
    title: 'Small Wins Strategy',
    content: "When I was depressed and couldn't study, I stopped trying to 'be productive'. I made a list of 'micro-tasks' like 'open the laptop' or 'read one paragraph'. It sounds silly, but the dopamine from checking them off helped me rebuild momentum.",
    tags: ['mental health', 'student stress'],
    author: 'Alex J.',
    matchReason: 'This matches your struggle with academic pressure and mental health.'
  }
];

export default function ResultsView({ query, onBack }: ResultsViewProps) {
  const [matches, setMatches] = useState<any[]>([]);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    if (query) {
      const q = query.toLowerCase();
      const filtered = MOCK_SOLUTIONS.filter(sol => 
        sol.tags.some(t => q.includes(t.toLowerCase().split(' ')[0])) ||
        sol.content.toLowerCase().includes(q.split(' ')[0])
      );
      
      setMatches(filtered.length > 0 ? filtered : [MOCK_SOLUTIONS[0]]);
      setSummary(`You've described an experience where you feel a deep need for connection and practical coping strategies. Our engine identified themes of resilience and shared human experience.`);
    }
  }, [query]);

  return (
    <main className="hero-content" style={{ marginTop: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '100vh', padding: '4rem 2rem' }}>
      <div className="glass-card fade-up-reveal" style={{ 
        maxWidth: '900px', 
        width: '100%', 
        background: 'rgba(255, 255, 255, 0.92)', 
        backdropFilter: 'blur(35px)',
        WebkitBackdropFilter: 'blur(35px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 50px 120px rgba(0, 0, 0, 0.2)',
        padding: '5rem 3.5rem',
        borderRadius: '50px',
        color: '#1a1a1a',
        textAlign: 'left',
        position: 'relative',
        zIndex: 20
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <button 
            onClick={onBack}
            style={{ background: 'transparent', border: 'none', color: '#999', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500 }}
          >
            ← Back
          </button>
          <span style={{ fontSize: '0.7rem', color: '#999', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Human Resilience Matching</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '3.5rem', fontWeight: 500, marginBottom: '2.5rem', letterSpacing: '-0.03em', color: '#1a1a1a', lineHeight: 1.1 }}>
          We've found <span style={{ fontStyle: 'italic', fontWeight: 400 }}>a way through.</span>
        </h1>
        
        <div style={{ padding: '2.5rem', background: 'rgba(0,0,0,0.03)', borderRadius: '24px', marginBottom: '4rem', border: '1px solid rgba(0,0,0,0.05)' }}>
          <p style={{ fontSize: '0.7rem', color: '#1a1a1a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem', opacity: 0.5 }}>Synthesis</p>
          <p style={{ fontSize: '1.25rem', lineHeight: 1.6, color: '#333', fontWeight: 300 }}>
            {summary}
          </p>
        </div>

        <section style={{ display: 'grid', gap: '2.5rem' }}>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>Shared Wisdom ({matches.length})</h2>
          {matches.map((match, i) => (
            <div key={match.id} className="fade-up-reveal" style={{ 
              animationDelay: `${i * 0.2 + 0.5}s`,
              padding: '3rem',
              background: 'white',
              borderRadius: '28px',
              border: '1px solid rgba(0,0,0,0.04)',
              boxShadow: '0 15px 35px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#999', fontWeight: 600, letterSpacing: '0.1em' }}>SHARED BY {match.author.toUpperCase()}</span>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  {match.tags.map((t: string) => (
                    <span key={t} style={{ fontSize: '0.65rem', padding: '0.3rem 0.8rem', background: 'rgba(0,0,0,0.04)', borderRadius: '20px', color: '#666', fontWeight: 500 }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '1.2rem', fontFamily: 'var(--font-serif, serif)', color: '#1a1a1a' }}>{match.title}</h3>
              <p style={{ fontSize: '1.15rem', lineHeight: 1.7, marginBottom: '2.5rem', color: '#444', fontWeight: 300 }}>
                {match.content}
              </p>
              <div style={{ padding: '1.2rem 1.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)' }}>
                <p style={{ fontSize: '0.95rem', color: '#555', fontStyle: 'italic' }}>
                  <strong style={{ fontWeight: 600, color: '#1a1a1a', fontStyle: 'normal' }}>Relevance:</strong> {match.matchReason}
                </p>
              </div>
            </div>
          ))}
        </section>

        <div style={{ marginTop: '5rem', textAlign: 'center' }}>
          <button onClick={onBack} className="btn-glass" style={{ background: '#1a1a1a', color: 'white', padding: '1rem 3rem', borderRadius: '50px', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
            Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}
