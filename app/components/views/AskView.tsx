'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface AskViewProps {
  onBack: () => void;
  onResults: (query: string) => void;
}

export default function AskView({ onBack, onResults }: AskViewProps) {
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [suggestedSummary, setSuggestedSummary] = useState('');
  const [status, setStatus] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAiTyping]);

  const handleSendMessage = async () => {
    if (!content.trim() || isAiTyping) return;

    const userMessage = content.trim();
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    
    setMessages(newMessages);
    setContent('');
    setIsAiTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'The connection failed.');
      }
      
      setMessages((prev) => [...prev, { role: 'model', content: data.response }]);
      setIsReady(data.isReadyToCast);
      if (data.isReadyToCast && data.suggestedStruggleSummary) {
        setSuggestedSummary(data.suggestedStruggleSummary);
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages((prev) => [...prev, { role: 'model', content: `[DEBUG ERROR]: ${error.message}` }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleCastBottle = () => {
    // Use suggested summary if available, otherwise use last user message
    const finalQuery = suggestedSummary || messages.filter(m => m.role === 'user').pop()?.content || '';
    onResults(finalQuery);
  };

  return (
    <main className="hero-content" style={{ marginTop: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100vh', padding: '1rem' }}>
      <div className="glass-card" style={{ 
        maxWidth: '900px', 
        width: '100%', 
        maxHeight: '85vh',
        background: 'rgba(255, 255, 255, 0.7)', 
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 50px 120px rgba(0, 0, 0, 0.2)',
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
            {/* Back Button (Top Left) */}
            <div style={{ position: 'absolute', top: '2rem', left: '2.5rem' }}>
              <button 
                onClick={onBack}
                style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500 }}
              >
                ← Back to Shore
              </button>
            </div>

            {/* Header */}
            <div style={{ marginBottom: '2rem', textAlign: 'center', padding: '0 1rem' }}>
              <h1 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: '2.4rem', fontWeight: 500, marginBottom: '0.6rem', letterSpacing: '-0.02em' }}>
                Find Wisdom in the Waves
              </h1>
              <p style={{ fontSize: '0.9rem', opacity: 0.6, fontWeight: 700, letterSpacing: '0.15em', color: '#1a1a1a', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
                Others have walked these shores before you.
              </p>
              <p style={{ fontSize: '1.05rem', opacity: 0.5, lineHeight: 1.6, fontWeight: 300, color: '#444', maxWidth: '800px', margin: '0 auto' }}>
                No one should have to navigate a storm alone. By sharing what you are facing, we can help you find the messages of wisdom left behind by those who survived the same tides.
              </p>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              style={{ 
                flex: 1, 
                overflowY: 'auto', 
                padding: '1rem 0',
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.5rem',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
              className="chat-thread"
            >
              {/* Initial Greeting */}
              <div style={{ alignSelf: 'flex-start', maxWidth: '85%', animation: 'fadeUp 0.6s ease out' }}>
                <div style={{ background: 'rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.08)', padding: '1.2rem 1.6rem', borderRadius: '0 20px 20px 20px', fontSize: '1.1rem', lineHeight: 1.5, fontWeight: 300, textAlign: 'left' }}>
                  Welcome. Speak your heart... what are you navigating in the vast ocean of life?
                </div>
              </div>

              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', 
                    maxWidth: '85%',
                    animation: 'fadeUp 0.4s ease out'
                  }}
                >
                  <div style={{ 
                    background: msg.role === 'user' ? '#1a1a1a' : 'rgba(0,0,0,0.08)', 
                    color: msg.role === 'user' ? 'white' : '#1a1a1a',
                    border: msg.role === 'user' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                    padding: '1.2rem 1.6rem', 
                    textAlign: 'left',
                    borderRadius: msg.role === 'user' ? '20px 20px 0 20px' : '0 20px 20px 20px', 
                    fontSize: '1.1rem', 
                    lineHeight: 1.5, 
                    fontWeight: 300,
                    boxShadow: msg.role === 'user' ? '0 10px 25px rgba(0,0,0,0.1)' : 'none'
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {isAiTyping && (
                <div style={{ alignSelf: 'flex-start', padding: '1rem 1.6rem' }}>
                  <div className="typing-dots" style={{ display: 'flex', gap: '4px' }}>
                    <div className="dot" style={{ width: '6px', height: '6px', background: '#aaa', borderRadius: '50%' }}></div>
                    <div className="dot" style={{ width: '6px', height: '6px', background: '#aaa', borderRadius: '50%' }}></div>
                    <div className="dot" style={{ width: '6px', height: '6px', background: '#aaa', borderRadius: '50%' }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(0,0,0,0.03)', borderRadius: '25px', padding: '0.5rem 0.5rem 0.5rem 1.5rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                <input 
                  autoFocus
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Share a struggle or ask a question..."
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
                  disabled={isSubmitting || isAiTyping}
                />
                <button 
                  onClick={handleSendMessage}
                  style={{ 
                    background: '#1a1a1a', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '20px', 
                    padding: '0.8rem 1.8rem', 
                    fontSize: '0.85rem', 
                    cursor: 'pointer',
                    opacity: content.trim() ? 1 : 0.4
                  }}
                  disabled={!content.trim() || isAiTyping}
                >
                  Send
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 0.5rem' }}>

                {isReady && (
                  <button 
                    onClick={handleCastBottle} 
                    className="btn-glass pulse-subtle"
                    style={{ 
                      background: 'linear-gradient(135deg, #2a2a2a, #1a1a1a)', 
                      color: 'white', 
                      padding: '1rem 2.8rem', 
                      borderRadius: '50px', 
                      fontSize: '0.9rem', 
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      border: 'none',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
                    }}
                  >
                    CAST BOTTLE →
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '3rem' }} className="fade-in">
            <div className="wave-container" style={{ opacity: 0.6, height: '60px', display: 'flex', alignItems: 'center' }}>
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className="wave-bar" 
                  style={{ 
                    animation: `waveHeight 1.5s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`, 
                    height: '20px', 
                    background: '#1a1a1a', 
                    width: '4px', 
                    margin: '0 4px',
                    borderRadius: '10px'
                  }}
                ></div>
              ))}
            </div>
            
            <h2 style={{ 
              fontFamily: 'var(--font-serif, serif)', 
              fontSize: '2.8rem', 
              color: '#1a1a1a', 
              fontWeight: 400, 
              letterSpacing: '-0.01em', 
              textAlign: 'center',
              minHeight: '8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 0
            }}>
              {status}
            </h2>
            
            <p style={{ opacity: 0.4, fontStyle: 'italic', fontSize: '1.1rem' }}>Sailing towards human connection...</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes waveHeight {
          0%, 100% { height: 20px; }
          50% { height: 60px; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pulse-subtle {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 15px 35px rgba(0,0,0,0.2); }
          50% { transform: scale(1.03); box-shadow: 0 20px 45px rgba(0,0,0,0.25); }
          100% { transform: scale(1); box-shadow: 0 15px 35px rgba(0,0,0,0.2); }
        }
        .typing-dots .dot {
          animation: dotBounce 1.4s infinite;
        }
        .typing-dots .dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        .chat-thread::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  );
}
