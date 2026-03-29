'use client';

import { useState } from 'react';

// Import View Components
import AskView from './components/views/AskView';
import ShareView from './components/views/ShareView';
import AboutView from './components/views/AboutView';
import ResultsView from './components/views/ResultsView';
import LookupView from './components/views/LookupView';

export default function HelpInABottleSPA() {
  const [activeView, setActiveView] = useState('home');
  const [displayView, setDisplayView] = useState('home');
  const [navStage, setNavStage] = useState('entering'); // 'entering' | 'exiting' | 'idle'
  const [query, setQuery] = useState('');

  // Cinematic staged transition logic
  const initiateTransition = (nextView: string) => {
    if (nextView === displayView) return;
    
    setNavStage('exiting');
    
    // Matches global.css transition duration (0.8s)
    setTimeout(() => {
      setDisplayView(nextView);
      setActiveView(nextView);
      setNavStage('entering');
      
      // Delay to ensure the new component is mounted before clearing entrance stage
      setTimeout(() => {
        setNavStage('idle');
      }, 50);
    }, 850);
  };

  const navigateToResults = (q: string) => {
    setQuery(q);
    initiateTransition('results');
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'ask':
        return <AskView onBack={() => initiateTransition('home')} onResults={navigateToResults} />;
      case 'share':
        return <ShareView onBack={() => initiateTransition('home')} />;
      case 'about':
        return <AboutView onBack={() => initiateTransition('home')} />;
      case 'results':
        return <ResultsView query={query} onBack={() => initiateTransition('home')} />;
      case 'lookup':
        return <LookupView onBack={() => initiateTransition('home')} />;
      default:
        return (
          <main className="hero-content">
            <h1 className="title-premium">
              Help in a Bottle
            </h1>
            
            <p className="subtitle-premium">
              Connecting communities, one message at a time.
            </p>
            
            <div className="button-group" style={{ flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center' }}>
                <button 
                  onClick={() => initiateTransition('ask')}
                  className="btn-glass"
                >
                  Ask for Help
                </button>
                
                <button 
                  onClick={() => initiateTransition('share')}
                  className="btn-glass"
                >
                  Give Help
                </button>
              </div>
            </div>
          </main>
        );
    }
  };

  return (
    <div className="hero-fullscreen">
      {/* Cinematic Video Background - Persists Across All Transitions */}
      <video 
        className="hero-background"
        autoPlay 
        muted 
        loop
        playsInline
      >
        <source src="/beach-video.mp4" type="video/mp4" />
      </video>
      
      {/* Depth & Legibility Overlay */}
      <div className="hero-overlay" />
      
      {/* Dynamic Animated Content Layer */}
      <div 
        className={navStage === 'exiting' ? 'view-exit' : (navStage === 'entering' ? 'view-enter' : 'fade-up-reveal')}
        style={{ width: '100%', height: '100%', position: 'relative', zIndex: 15 }}
      >
        {renderActiveView()}
      </div>

      {/* Minimalism branding anchor (Static on Home) */}
      {displayView === 'home' && navStage !== 'exiting' && (
        <div style={{ position: 'absolute', bottom: '6.5rem', width: '100%', textAlign: 'center', zIndex: 20, display: 'flex', justifyContent: 'center', gap: '1rem' }} className="fade-up-reveal">
          <button 
            onClick={() => initiateTransition('about')}
            className="btn-glass" 
            style={{ borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', padding: '0.6rem 1.5rem', fontSize: '0.7rem', letterSpacing: '0.15em' }}
          >
            About
          </button>
          <button 
            onClick={() => initiateTransition('lookup')}
            className="btn-glass" 
            style={{ borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', padding: '0.6rem 1.5rem', fontSize: '0.7rem', letterSpacing: '0.15em' }}
          >
            Check Status
          </button>
        </div>
      )}

      {displayView === 'home' && navStage !== 'exiting' && (
        <div style={{ position: 'absolute', bottom: '3rem', width: '100%', textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', letterSpacing: '0.5em', textTransform: 'uppercase', zIndex: 20, fontWeight: 300, textShadow: '0 2px 10px rgba(0,0,0,0.4)' }} className="fade-up-reveal">
          Lived Experience • Shared Wisdom • Human Connection
        </div>
      )}
    </div>
  );
}
