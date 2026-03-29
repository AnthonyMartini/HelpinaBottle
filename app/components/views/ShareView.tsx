'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface ShareViewProps {
  onBack: () => void;
}

export default function ShareView({ onBack }: ShareViewProps) {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [refinedStory, setRefinedStory] = useState('');
  const [suggestedTitle, setSuggestedTitle] = useState('');
  const [suggestedTags, setSuggestedTags] = useState('');
  const [error, setError] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAiTyping]);

  const handleReviewRequest = async () => {
    if (!draft.trim() || isAiTyping) return;

    const userMessage = `I have drafted this story: "${draft.trim()}". Please review it.`;
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    
    setMessages(newMessages);
    setIsAiTyping(true);
    setError('');

    try {
      const response = await fetch('/api/share-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'The connection failed.');
      }
      
      setMessages((prev) => [...prev, { role: 'model', content: data.response }]);
      if (data.isStoryComplete) {
        setIsReady(true);
        setRefinedStory(data.refinedStory || '');
        setSuggestedTitle(data.suggestedTitle || '');
        setSuggestedTags(data.suggestedTags || '');
      } else {
        setIsReady(false);
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages((prev) => [...prev, { role: 'model', content: `[DEBUG ERROR]: ${error.message}` }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleCastIntoTheSea = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      // Use refined story or the original draft if refined is unavailable
      const finalStory = refinedStory || draft || messages.map(m => m.content).join('\n\n');
      const finalTitle = suggestedTitle || 'A Shared Wisdom';
      const finalTags = suggestedTags || '';
      
      const fullText = `Title: ${finalTitle}\n\nStory: ${finalStory}\n\nTags: ${finalTags}`;
      
      const response = await fetch('/api/write', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: fullText }),
      });

      if (!response.ok) {
        throw new Error('The waves are too rough to carry your message right now.');
      }

      setIsSuccess(true);
      
      setTimeout(() => {
        onBack();
      }, 4000);
    } catch (err: any) {
      console.error('Share error:', err);
      setError(err.message || 'Something went wrong while casting your bottle.');
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="hero-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100%', padding: '1rem' }}>
        <div className="glass-card success-state fade-in" style={{ 
          maxWidth: '600px', 
          width: '100%', 
          background: 'rgba(255, 255, 255, 0.7)', 
          backdropFilter: 'blur(45px)',
          WebkitBackdropFilter: 'blur(45px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 50px 150px rgba(0, 0, 0, 0.2)',
          padding: '5rem 3rem',
          borderRadius: '50px',
          textAlign: 'center',
          color: '#1a1a1a'
        }}>
          <div className="sailing-bottle" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative' }}>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v2H9V5Z"/>
                <path d="M15 7v1c0 2 1 3 3 5v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-6c2-2 3-3 3-5V7"/>
              </svg>
            </div>
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '2.6rem', fontWeight: 300, marginBottom: '1.2rem', letterSpacing: '0.05em', color: '#1a1a1a' }}>
            Your wisdom has been <span style={{ fontStyle: 'italic' }}>cast.</span>
          </h2>
          <p style={{ fontSize: '0.8rem', opacity: 0.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a1a1a', marginBottom: '2.5rem' }}>It is now sailing towards someone who needs it.</p>
        </div>
        <style jsx>{`
          .sailing-bottle {
            animation: float 6s ease-in-out infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          .fade-in {
            animation: fadeIn 1.5s ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="hero-content" style={{ marginTop: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100vh', padding: '1rem' }}>
      <div className="glass-card" style={{ 
        maxWidth: '1200px', 
        width: '95%', 
        maxHeight: '90vh',
        background: 'rgba(255, 255, 255, 0.7)', 
        backdropFilter: 'blur(45px)',
        WebkitBackdropFilter: 'blur(45px)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 50px 150px rgba(0, 0, 0, 0.2)',
        padding: '3rem 2.5rem',
        borderRadius: '35px',
        color: '#1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 20,
        overflow: 'hidden'
      }}>
        {!isSubmitting ? (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }} className="fade-up-reveal">
            {/* Back Button */}
            <div style={{ position: 'absolute', top: '1.5rem', left: '2rem' }}>
              <button 
                onClick={onBack}
                style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500 }}
              >
                ← Back to Shore
              </button>
            </div>

            {/* Header */}
            <div style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '0 2rem' }}>
              <h1 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '2.2rem', fontWeight: 500, marginBottom: '0.5rem' }}>Share Your Wisdom</h1>
              <p style={{ fontSize: '0.85rem', opacity: 0.6, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Your journey is someone else's map.</p>
              <p style={{ fontSize: '1rem', opacity: 0.5, lineHeight: 1.5, fontWeight: 300, maxWidth: '900px', margin: '0 auto' }}>
                Your journey is a lighthouse for those still adrift. Share what you learned so no one has to navigate the darkness alone.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', flex: 1, minHeight: 0 }}>
              
              {/* Left Column: Input Area */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '0.8rem', fontWeight: 700 }}>Write Your Experience</label>

            <textarea 
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Tell us what you learned from a struggle you overcame..."
                    style={{ 
                      flex: 1,
                      width: '100%',
                      background: 'rgba(255,255,255,0.4)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      borderRadius: '20px',
                      padding: '1.5rem',
                      fontSize: '1.1rem',
                      lineHeight: '1.6',
                      color: '#1a1a1a',
                      fontFamily: 'inherit',
                      resize: 'none',
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                  />
                </div>
                
                <button 
              onClick={handleReviewRequest}
              disabled={!draft.trim() || isAiTyping}
              className="btn-glass"
              style={{ 
                background: '#1a1a1a', 
                color: 'white', 
                padding: '1.2rem 2.5rem', 
                borderRadius: '50px', 
                fontSize: '0.9rem', 
                letterSpacing: '0.1em',
                cursor: 'pointer',
                border: 'none',
                width: '100%',
                marginTop: '1.5rem',
                opacity: (!draft.trim() || isAiTyping) ? 0.4 : 1,
                boxShadow: isAiTyping ? 'none' : '0 10px 30px rgba(0,0,0,0.2)'
              }}
            >
              {isAiTyping ? 'SCRIBE IS REVIEWING...' : 'CONSULT WITH SCRIBE'}
            </button>

                {isReady && (
                  <div style={{ 
                    background: 'rgba(255,255,255,0.8)', 
                    padding: '1.5rem', 
                    borderRadius: '20px', 
                    border: '2px solid #1a1a1a',
                    animation: 'fadeUp 0.5s ease'
                  }}>
                    <h3 style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.5, marginBottom: '0.8rem' }}>The Scribe suggests:</h3>
                    <p style={{ fontSize: '1rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>"{refinedStory}"</p>
                    <button 
                      onClick={handleCastIntoTheSea}
                      style={{ 
                        width: '100%',
                        background: 'linear-gradient(135deg, #1a1a1a, #444)',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: '15px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                      }}
                    >
                      CAST WISDOM →
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Chat Consultation */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                background: 'rgba(0,0,0,0.03)', 
                borderRadius: '25px', 
                padding: '1.5rem',
                border: '1px solid rgba(0,0,0,0.02)',
                minHeight: 0
              }}>
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4, marginBottom: '1rem', textAlign: 'center' }}>Scribe Consultation</div>
                <div 
                  ref={scrollRef}
                  style={{ 
                    flex: 1, 
                    overflowY: 'auto', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1rem',
                    scrollbarWidth: 'none'
                  }}
                >
                  <div style={{ 
                    alignSelf: 'flex-start', 
                    maxWidth: '90%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}>
                    <span style={{ 
                      fontSize: '0.65rem', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.1em', 
                      opacity: 0.4, 
                      marginBottom: '0.4rem',
                      fontWeight: 700
                    }}>
                      Scribe
                    </span>
                    <div style={{ background: 'white', padding: '1rem', borderRadius: '0 15px 15px 15px', fontSize: '0.9rem', lineHeight: 1.4, border: '1px solid rgba(0,0,0,0.05)' }}>
                      Welcome. Drafe your wisdom and I will help you ensure it can properly guide the lost.
                    </div>
                  </div>
                  {messages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', 
                        maxWidth: '90%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <span style={{ 
                        fontSize: '0.65rem', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.1em', 
                        opacity: 0.4, 
                        marginBottom: '0.4rem',
                        fontWeight: 700
                      }}>
                        {msg.role === 'user' ? 'You' : 'Scribe'}
                      </span>
                      <div style={{ 
                        background: msg.role === 'user' ? '#1a1a1a' : 'white', 
                        color: msg.role === 'user' ? 'white' : '#1a1a1a',
                        padding: '1rem', 
                        borderRadius: msg.role === 'user' ? '15px 15px 0 15px' : '0 15px 15px 15px', 
                        fontSize: '0.9rem', 
                        lineHeight: 1.4,
                        border: msg.role === 'user' ? 'none' : '1px solid rgba(0,0,0,0.05)'
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isAiTyping && (
                    <div style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '3px' }}>
                        <div style={{ width: '4px', height: '4px', background: '#aaa', borderRadius: '50%', animation: 'dotBounce 1.4s infinite' }}></div>
                        <div style={{ width: '4px', height: '4px', background: '#aaa', borderRadius: '50%', animation: 'dotBounce 1.4s infinite', animationDelay: '0.2s' }}></div>
                        <div style={{ width: '4px', height: '4px', background: '#aaa', borderRadius: '50%', animation: 'dotBounce 1.4s infinite', animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {error && <div style={{ color: '#d32f2f', fontSize: '0.8rem', marginTop: '1rem', textAlign: 'center' }}>{error}</div>}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '2rem' }}>
             <p className="pulse" style={{ fontSize: '1.5rem', fontWeight: 300, letterSpacing: '0.1em' }}>Sealing your wisdom...</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
        }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </main>
  );
}
