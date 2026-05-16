import { useState, useEffect } from 'react';
import { SOCIALS } from "../constants/constants";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = ['About', 'Skills', 'Projects', 'GitHub', 'Timeline', 'Contact'];
  const scroll = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: '0 clamp(24px,5vw,80px)', height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(5,5,5,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(192,57,43,0.12)' : '1px solid transparent',
      transition: 'all 0.4s ease'
    }}>
      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: '0.15em', color: '#fff', cursor: 'pointer' }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        AAD
      </div>

      {/* Desktop Links */}
      <div style={{ display: 'flex', gap: 28, alignItems: 'center' }} className="desk-nav">
        {links.map(l => (
          <button key={l} onClick={() => scroll(l)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontSize: 12, letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--red-glow)'}
            onMouseLeave={e => e.target.style.color = 'var(--muted)'}
          >{l}</button>
        ))}
        <a href={`mailto:${SOCIALS.email}`}
          style={{ background: 'transparent', border: '1px solid var(--red)', color: 'var(--red)', padding: '6px 20px', borderRadius: 2, fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: '0.15em', textDecoration: 'none', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--red)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--red)'; }}>
          HIRE ME
        </a>
      </div>

      {/* Mobile Hamburger */}
      <button onClick={() => setMenuOpen(o => !o)} className="hamburger"
        style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', flexDirection: 'column', gap: 5 }}>
        {[0, 1, 2].map(i => <div key={i} style={{ width: 24, height: 1.5, background: '#fff' }} />)}
      </button>

      {menuOpen && (
        <div style={{ position: 'absolute', top: 64, left: 0, right: 0, background: 'rgba(5,5,5,0.98)', backdropFilter: 'blur(20px)', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 24, borderBottom: '1px solid var(--border)' }}>
          {links.map(l => (
            <button key={l} onClick={() => scroll(l)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: '#fff', textAlign: 'left', letterSpacing: '0.1em' }}>
              {l}
            </button>
          ))}
        </div>
      )}
      <style>{`@media(max-width:768px){.desk-nav{display:none!important;}.hamburger{display:flex!important;}}`}</style>
    </nav>
  );
}
