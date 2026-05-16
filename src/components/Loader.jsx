import { useState, useEffect } from 'react';

export default function Loader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('load');

  useEffect(() => {
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(iv); return 100; }
        return p + Math.random() * 6 + 2;
      });
    }, 60);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => setPhase('out'), 500);
      setTimeout(() => onDone(), 1800);
    }
  }, [progress, onDone]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000, background: '#000',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      animation: phase === 'out' ? 'loaderOut 1.2s cubic-bezier(0.77,0,0.18,1) forwards' : 'none'
    }}>
      {/* Scanline */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'rgba(192,57,43,0.15)', animation: 'scanline 2s linear infinite' }} />
      </div>
      {/* Grid */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'linear-gradient(rgba(192,57,43,1) 1px,transparent 1px),linear-gradient(90deg,rgba(192,57,43,1) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      {/* Logo */}
      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(48px,10vw,120px)', letterSpacing: '0.05em', color: '#fff', animation: 'logoReveal 1.4s cubic-bezier(0.16,1,0.3,1) forwards', textShadow: '0 0 40px rgba(192,57,43,0.6)', lineHeight: 1 }}>
        AAD
      </div>
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '11px', letterSpacing: '0.4em', color: 'var(--red)', marginTop: 12, opacity: 0.7, textTransform: 'uppercase' }}>
        AARYAN ADITYA DAS
      </div>
      {/* Progress */}
      <div style={{ marginTop: 60, width: 240, height: 1, background: 'rgba(255,255,255,0.08)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'linear-gradient(90deg,var(--red-dim),var(--red-glow))', width: `${Math.min(progress, 100)}%`, transition: 'width 0.1s ease', boxShadow: '0 0 8px var(--red-glow)' }} />
      </div>
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '10px', color: 'var(--muted)', marginTop: 12, letterSpacing: '0.2em' }}>
        {Math.min(Math.round(progress), 100).toString().padStart(3, '0')}
      </div>
    </div>
  );
}
