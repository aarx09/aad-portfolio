import { useState, useCallback, useRef, useEffect } from 'react';
import Loader from './components/Loader';
import Nav from './components/Nav';
import { SOCIALS, ROLES, GITHUB_USERNAME } from "./constants/constants";

// ─── Cursor Glow ──────────────────────────────────────────────────────────────
function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    const move = e => {
      if (ref.current) {
        ref.current.style.left = e.clientX + 'px';
        ref.current.style.top  = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return (
    <div ref={ref} style={{
      position: 'fixed', pointerEvents: 'none', zIndex: 9999,
      width: 400, height: 400, borderRadius: '50%',
      background: 'radial-gradient(circle,rgba(192,57,43,0.12) 0%,transparent 70%)',
      transform: 'translate(-50%,-50%)',
      animation: 'cursorGlow 3s ease-in-out infinite',
      transition: 'left 0.15s ease, top 0.15s ease'
    }} />
  );
}

// ─── Particles ────────────────────────────────────────────────────────────────
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.4, dy: (Math.random() - 0.5) * 0.4,
      a: Math.random()
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,50,50,${p.a * 0.85})`;
ctx.shadowBlur = 12;
ctx.shadowColor = 'rgba(255,0,0,0.6)'; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(255,40,40,${0.22 * (1 - d / 120)})`; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} />;
}

// ─── Section Wrapper (scroll reveal) ─────────────────────────────────────────
function Section({ id, children, style = {} }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <section id={id} ref={ref} style={{
      padding: '80px clamp(20px,5vw,90px)',
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(50px)',
      transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)',
      ...style
    }}>
      {children}
    </section>
  );
}

const SectionLabel = ({ text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
    <div style={{ width: 40, height: 1, background: 'var(--red)' }} />
    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '0.4em', color: 'var(--red)', textTransform: 'uppercase' }}>{text}</span>
  </div>
);
const SectionTitle = ({ children }) => (
  <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(36px,7vw,80px)', letterSpacing: '0.03em', color: '#fff', lineHeight: 0.95, marginBottom: 48 }}>{children}</h2>
);

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setRoleIdx(i => (i + 1) % ROLES.length); setVisible(true); }, 500);
    }, 2800);
    return () => clearInterval(t);
  }, []);
  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', textAlign: 'center', padding: '120px clamp(24px,6vw,120px) 80px' }}>
      <Particles />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(192,57,43,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(192,57,43,0.08) 1px,transparent 1px)', backgroundSize: '80px 80px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,40,40,0.26) 0%,transparent 72%)', pointerEvents: 'none', animation: 'cursorGlow 4s ease-in-out infinite' }} />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: '0.5em', color: 'var(--red)', marginBottom: 32, textTransform: 'uppercase', animation: 'fadeIn 1s 0.3s both' }}>◆ PORTFOLIO  ◆</div>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(52px,9vw,130px)', lineHeight: 0.92, letterSpacing: '0.02em', color: '#fff', animation: 'fadeUp 1s 0.5s both' }}>
          <span style={{ display: 'block' }}>AARYAN</span>
          <span style={{
  display: 'block',
  color: 'transparent',
  WebkitTextStroke: '2.4px rgba(255,255,255,0.55)',
  textShadow: `
    0 0 10px rgba(255,0,0,0.18),
    0 0 22px rgba(255,0,0,0.12)
  `,
  opacity: 0.9
}}>
  ADITYA
</span>
          <span style={{ display: 'block' }}>DAS</span>
        </div>
        <div style={{ height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 24 }}>
          <span style={{ color: 'var(--muted)', fontFamily: "'Space Mono',monospace", fontSize: 14, marginRight: 12 }}>—</span>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(16px,3vw,22px)', fontWeight: 300, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--red-glow)', transition: 'opacity 0.5s, transform 0.5s', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-12px)' }}>{ROLES[roleIdx]}</span>
          <span style={{ color: 'var(--muted)', fontFamily: "'Space Mono',monospace", fontSize: 14, marginLeft: 12 }}>—</span>
        </div>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 300, fontSize: 'clamp(13px,2vw,17px)', color: 'var(--muted)', maxWidth: 480, margin: '24px auto 0', lineHeight: 1.8, animation: 'fadeIn 1s 1.3s both' }}>
          Building systems that think. Crafting interfaces that speak.<br />Engineering the future, one commit at a time.
        </p>
        {/* Social Quick Links */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 36, animation: 'fadeIn 1s 1.4s both', flexWrap: 'wrap' }}>
          {[{ label: 'Instagram', url: SOCIALS.instagram }, { label: 'LinkedIn', url: SOCIALS.linkedin }, { label: 'GitHub', url: SOCIALS.github }].map(s => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
              style={{ padding: '8px 18px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2, textDecoration: 'none', fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
              {s.label}
            </a>
          ))}
        </div>
        {/* CTA */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24, animation: 'fadeUp 1s 1.5s both', flexWrap: 'wrap' }}>
          <button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ background: 'var(--red)', color: '#fff', border: 'none', padding: '14px 36px', fontFamily: "'Outfit',sans-serif", fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2, boxShadow: '0 0 30px rgba(192,57,43,0.4)', transition: 'all 0.3s' }}
            onMouseEnter={e => { e.target.style.boxShadow = '0 0 50px rgba(231,76,60,0.6)'; e.target.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.target.style.boxShadow = '0 0 30px rgba(192,57,43,0.4)'; e.target.style.transform = 'translateY(0)'; }}>
            View Work
          </button>
          <a href={`mailto:${SOCIALS.email}`}
            style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', padding: '14px 36px', fontFamily: "'Outfit',sans-serif", fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', borderRadius: 2, transition: 'all 0.3s', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}>
            Get In Touch
          </a>
        </div>
        <div style={{ marginTop: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0.4 }}>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom,transparent,var(--red))' }} />
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.3em', color: 'var(--muted)' }}>SCROLL</span>
        </div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  return (
    <Section id="about" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
        <div>
          <SectionLabel text="01 / About" />
          <SectionTitle>WHO IS<br />AARYAN?</SectionTitle>
          <p style={{ color: 'var(--muted)', lineHeight: 1.9, fontSize: 16, marginBottom: 24, fontWeight: 300 }}>I'm a builder at heart — someone who sits at the intersection of technology, creativity, and vision. I don't just write code; I architect experiences that leave an impression.</p>
          <p style={{ color: 'var(--muted)', lineHeight: 1.9, fontSize: 16, marginBottom: 40, fontWeight: 300 }}>Currently exploring AI systems, automation, and premium digital interfaces. My mission: turn ideas into engines that run themselves.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[['Location', 'Odisha, India'], ['Focus', 'AI + Web Systems'], ['Status', 'Open to Work'], ['Mission', 'Build the Future']].map(([k, v]) => (
              <div key={k} style={{ borderLeft: '1px solid var(--red)', paddingLeft: 16 }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.3sem', color: 'var(--red)', textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
                <div style={{ fontSize: 14, color: '#ccc', fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ background: 'linear-gradient(135deg,var(--surface-2) 0%,#1a0a0a 100%)', border: '1px solid var(--border)', borderRadius: 4, padding: 40, boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 80, color: 'transparent', WebkitTextStroke: '1px rgba(192,57,43,0.3)', lineHeight: 1 }}>AAD</div>
            <div style={{ marginTop: 24 }}>
              {[{ label: 'Vision', value: 'Create systems that outlive their creator' }, { label: 'Philosophy', value: 'Build once, scale forever' }, { label: 'Superpower', value: 'Turning chaos into architecture' }].map(({ label, value }) => (
                <div key={label} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '16px 0' }}>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'var(--red)', letterSpacing: '0.3em', marginBottom: 6, textTransform: 'uppercase' }}>{label}</div>
                  <div style={{ fontSize: 13, color: '#aaa', fontStyle: 'italic' }}>"{value}"</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'absolute', top: -1, right: -1, width: 40, height: 40, borderTop: '1px solid var(--red)', borderRight: '1px solid var(--red)' }} />
          <div style={{ position: 'absolute', bottom: -1, left: -1, width: 40, height: 40, borderBottom: '1px solid var(--red)', borderLeft: '1px solid var(--red)' }} />
        </div>
      </div>
    </Section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────
const SKILLS = [
  { title: 'Web Development', icon: '⬡', desc: 'React, Next.js, Vite, TailwindCSS', level: 88 },
  { title: 'AI & LLM Tools', icon: '◈', desc: 'Claude, GPT, prompt engineering', level: 82 },
  { title: 'UI/UX Design', icon: '◉', desc: 'Figma, design systems, motion design', level: 75 },
  { title: 'Automation', icon: '⟲', desc: 'N8N, Zapier, APIs, workflow bots', level: 78 },
  { title: 'Design Thinking', icon: '◇', desc: 'Problem framing, ideation, iteration', level: 85 },
  { title: 'System Architecture', icon: '⊕', desc: 'Databases, backend flows, scalable systems', level: 70 },
];

function SkillCard({ title, icon, desc, level }) {
  const [hover, setHover] = useState(false);
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background: hover ? 'linear-gradient(135deg,#1a0808,var(--surface-2))' : 'var(--surface-2)', border: hover ? '1px solid var(--red)' : '1px solid rgba(255,255,255,0.05)', borderRadius: 4, padding: 28, boxShadow: hover ? '0 0 40px rgba(192,57,43,0.2)' : 'none', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)', transform: hover ? 'translateY(-6px)' : 'translateY(0)', opacity: vis ? 1 : 0 }}>
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 28, color: 'var(--red)', marginBottom: 16 }}>{icon}</div>
      <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 16, marginBottom: 8, color: '#fff' }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 20 }}>{desc}</div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.12)', position: 'relative', overflow: 'hidden', borderRadius: 999 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'linear-gradient(90deg,var(--red-dim),var(--red-glow))', width: vis ? `${level}%` : '0%', transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)', boxShadow: '0 0 8px var(--red)' }} />
      </div>
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'rgb(255, 0, 0)', marginTop: 8, letterSpacing: '0.2em' }}>{level}%</div>
    </div>
  );
}

function Skills() {
  return (
    <Section id="skills">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionLabel text="02 / Skills" />
        <SectionTitle>WHAT I<br />DO BEST</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {SKILLS.map(s => <SkillCard key={s.title} {...s} />)}
        </div>
      </div>
    </Section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────
const PROJECTS = [
  { id: 1, title: 'Neural Interface', tags: ['React', 'AI', 'Appwrite'], desc: 'A real-time AI-powered dashboard that transforms raw data into actionable insights.', status: 'Live' },
  { id: 2, title: 'Phantom OS', tags: ['Next.js', 'Framer', 'GSAP'], desc: 'A cinematic personal OS-style portfolio experiment with custom cursor and 3D scenes.', status: 'WIP' },
  { id: 3, title: 'AutoPilot CRM', tags: ['Automation', 'N8N', 'AI'], desc: 'A fully automated CRM engine that handles outreach, follow-ups, and lead scoring.', status: 'Live' },
];
const statusColor = { Live: '#27AE60', WIP: 'var(--red)', Beta: '#F39C12' };

function ProjectCard({ title, tags, desc, status }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background: 'var(--surface-2)', border: hover ? '1px solid var(--red)' : '1px solid rgba(255,255,255,0.05)', borderRadius: 4, padding: 28, position: 'relative', overflow: 'hidden', boxShadow: hover ? '0 20px 60px rgba(192,57,43,0.2)' : 'none', transform: hover ? 'translateY(-8px)' : 'translateY(0)', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: '#fff', letterSpacing: '0.05em' }}>{title}</div>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, padding: '4px 10px', borderRadius: 2, border: `1px solid ${statusColor[status]}`, color: statusColor[status], letterSpacing: '0.2em' }}>{status}</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 20 }}>{desc}</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {tags.map(t => <span key={t} style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'var(--red)', border: '1px solid rgba(192,57,43,0.3)', padding: '3px 10px', borderRadius: 2, letterSpacing: '0.15em' }}>{t}</span>)}
      </div>
      <a href={SOCIALS.github} target="_blank" rel="noopener noreferrer"
        style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'var(--muted)', padding: '6px 16px', borderRadius: 2, fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '0.1em', textDecoration: 'none', transition: 'all 0.2s', display: 'inline-block' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--muted)'; }}>
        GitHub ↗
      </a>
    </div>
  );
}

function Projects() {
  return (
    <Section id="projects" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionLabel text="03 / Projects" />
        <SectionTitle>SELECTED<br />WORK</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
          {PROJECTS.map(p => <ProjectCard key={p.id} {...p} />)}
        </div>
      </div>
    </Section>
  );
}

// ─── GitHub Live Repos ────────────────────────────────────────────────────────
const langColors = { JavaScript: '#F7DF1E', TypeScript: '#3178C6', Python: '#3572A5', HTML: '#E34C26', CSS: '#563D7C', default: '#C0392B' };

function RepoCard({ repo, delay }) {
  const [hover, setHover] = useState(false);
  const color = langColors[repo.language] || langColors.default;
  return (
    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div style={{ background: 'var(--surface-2)', border: hover ? '1px solid var(--red)' : '1px solid rgba(255,255,255,0.05)', borderRadius: 4, padding: 22, height: '100%', transform: hover ? 'translateY(-4px)' : 'translateY(0)', boxShadow: hover ? '0 12px 40px rgba(192,57,43,0.15)' : 'none', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)', animation: `repoCard 0.5s ${delay}ms both`, cursor: 'pointer' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 15, color: '#fff' }}>{repo.name}</div>
          <span style={{ fontSize: 14, opacity: 0.5, color: '#fff' }}>↗</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 16, minHeight: 36 }}>{repo.description || 'No description'}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          {repo.language && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>{repo.language}</span>
            </div>
          )}
          {repo.stargazers_count > 0 && <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>★ {repo.stargazers_count}</span>}
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.2)', marginLeft: 'auto' }}>{new Date(repo.updated_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
        </div>
      </div>
    </a>
  );
}

function GitHub() {
  const [repos, setRepos] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`)
    ]).then(([pr, rr]) => Promise.all([pr.json(), rr.json()]))
      .then(([p, r]) => { setProfile(p); setRepos(r.filter(x => !x.fork).slice(0, 6)); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Section id="github">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionLabel text="04 / GitHub" />
        <SectionTitle>LIVE<br />REPOS</SectionTitle>
        {profile && (
          <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 4, padding: 28, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <img src={profile.avatar_url} alt="avatar" style={{ width: 72, height: 72, borderRadius: '50%', border: '2px solid var(--red)', boxShadow: '0 0 20px rgba(192,57,43,0.3)' }} onError={e => e.target.style.display = 'none'} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: '#fff', letterSpacing: '0.05em' }}>{profile.name || GITHUB_USERNAME}</div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'var(--red)', letterSpacing: '0.2em', marginBottom: 8 }}>@{profile.login}</div>
              {profile.bio && <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>{profile.bio}</div>}
              <div style={{ display: 'flex', gap: 24 }}>
                {[['Repos', profile.public_repos], ['Followers', profile.followers], ['Following', profile.following]].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: '#fff' }}>{v}</div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, color: 'var(--muted)', letterSpacing: '0.2em' }}>{k.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </div>
            <a href={SOCIALS.github} target="_blank" rel="noopener noreferrer"
              style={{ background: 'transparent', border: '1px solid var(--red)', color: 'var(--red)', padding: '10px 24px', borderRadius: 2, fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '0.2em', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--red)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--red)'; }}>
              VIEW PROFILE ↗
            </a>
          </div>
        )}
        {loading && <div style={{ textAlign: 'center', padding: 60 }}><div style={{ width: 32, height: 32, border: '2px solid rgba(192,57,43,0.2)', borderTop: '2px solid var(--red)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} /><div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'var(--muted)', letterSpacing: '0.3em' }}>FETCHING REPOS...</div></div>}
        {error && !loading && <div style={{ textAlign: 'center', padding: 40, border: '1px solid rgba(192,57,43,0.2)', borderRadius: 4 }}><a href={SOCIALS.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)', fontFamily: "'Space Mono',monospace", fontSize: 10 }}>VIEW ON GITHUB ↗</a></div>}
        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>
            {repos.map((repo, i) => <RepoCard key={repo.id} repo={repo} delay={i * 80} />)}
          </div>
        )}
      </div>
    </Section>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
const MILESTONES = [
  {
    year: '2021-2022',
    title: 'INTRODUCED TO PROGRAMMING',
    desc: 'Started learning Python and SQL while building a strong foundation in programming, logic, and software development.',
    tag: 'FOUNDATION'
  },

  {
    year: '2022-2023',
    title: 'FIRST AI PROJECT BUILT',
    desc: 'Created a face analysis system using Python and continuously upgraded it step by step while mastering the fundamentals.',
    tag: 'PROJECT'
  },

  {
    year: '2023-2024',
    title: 'LEARNED C PROGRAMMING',
    desc: 'Completed the basics of C programming including memory concepts, structured logic, and problem solving.',
    tag: 'LANGUAGE'
  },

  {
    year: '2024-2025',
    title: 'ENTERED C++ DEVELOPMENT',
    desc: 'Learned the foundations of object-oriented programming and strengthened algorithmic thinking through C++.',
    tag: 'C++'
  },

  {
    year: '2025-2026',
    title: 'JAVA & ADVANCED DEVELOPMENT',
    desc: 'Currently learning Java while exploring backend systems, scalable architectures, and advanced software engineering.',
    tag: 'LEARNING'
  }
];

function Timeline() {
  return (
    <Section id="timeline" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <SectionLabel text="05 / Timeline" />
        <SectionTitle>THE<br />JOURNEY</SectionTitle>
        <div style={{ position: 'relative', paddingLeft: 32 }}>
          <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 1, background: 'linear-gradient(to bottom,var(--red),transparent)' }} />
          {MILESTONES.map((m, i) => (
            <div key={i} style={{ position: 'relative', marginBottom: 48 }}>
              <div style={{ position: 'absolute', left: -36, top: 6, width: 9, height: 9, borderRadius: '50%', background: 'var(--red)', boxShadow: '0 0 12px var(--red-glow)', animation: 'timelineDot 2s ease-in-out infinite' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'var(--red)', letterSpacing: '0.2em' }}>{m.year}</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 8, padding: '2px 8px', border: '1px solid rgba(192,57,43,0.4)', color: 'var(--red)', letterSpacing: '0.2em', borderRadius: 2 }}>{m.tag}</span>
              </div>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: '0.05em', color: '#fff', marginBottom: 8 }}>{m.title}</div>
              <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    window.open(`mailto:${SOCIALS.email}?subject=${subject}&body=${body}`, '_blank');
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  const socials = [
    { name: 'Instagram', handle: '@aaryan_aditya_das09', url: SOCIALS.instagram, icon: '📸' },
    { name: 'LinkedIn', handle: 'Aaryan Aditya Das', url: SOCIALS.linkedin, icon: '💼' },
    { name: 'GitHub', handle: '@aarx09', url: SOCIALS.github, icon: '⚡' },
    { name: 'Email', handle: 'aaryanaditya09@gmail.com', url: `mailto:${SOCIALS.email}`, icon: '✉️' },
  ];

  const inputStyle = { background: 'var(--surface-2)', border: '1px solid rgba(255,255,255,0.08)', color: '#e8e8e8', fontFamily: "'Outfit',sans-serif", fontSize: 14, padding: '12px 16px', borderRadius: 3, width: '100%', outline: 'none', transition: 'border-color 0.2s' };

  return (
    <Section id="contact">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionLabel text="06 / Contact" />
        <SectionTitle>LET'S<br />BUILD</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
          <div>
            <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 32, fontWeight: 300 }}>Have a project in mind? Drop a message below.</p>
            {sent ? (
              <div style={{ padding: 32, border: '1px solid rgba(39,174,96,0.3)', borderRadius: 4, background: 'rgba(39,174,96,0.05)', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: '#27AE60', letterSpacing: '0.05em', marginBottom: 8 }}>✓ MESSAGE SENT</div>
                <button onClick={() => setSent(false)} style={{ marginTop: 16, background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--muted)', padding: '8px 20px', borderRadius: 2, fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.2em', cursor: 'pointer' }}>SEND ANOTHER</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'var(--red)', letterSpacing: '0.25em', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>Your Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                </div>
                <div>
                  <label style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'var(--red)', letterSpacing: '0.25em', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>Your Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                </div>
                <div>
                  <label style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'var(--red)', letterSpacing: '0.25em', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>Message</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Hey Aaryan, I'd love to collaborate on..." rows={5} style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = 'var(--red)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                </div>
                <button onClick={handleSubmit} disabled={!form.name || !form.email || !form.message}
                  style={{ background: (!form.name || !form.email || !form.message) ? 'rgba(255,255,255,0.05)' : 'var(--red)', border: 'none', color: (!form.name || !form.email || !form.message) ? 'var(--muted)' : '#fff', padding: '14px', borderRadius: 3, fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: '0.2em', cursor: (!form.name || !form.email || !form.message) ? 'not-allowed' : 'pointer', boxShadow: '0 0 20px rgba(192,57,43,0.2)', transition: 'all 0.3s' }}>
                  SEND MESSAGE ↗
                </button>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {socials.map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4, textDecoration: 'none', background: 'var(--surface-2)', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.transform = 'translateX(8px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                <div style={{ fontSize: 20, width: 36, textAlign: 'center' }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 15, color: '#fff', marginBottom: 3 }}>{s.name}</div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em' }}>{s.handle}</div>
                </div>
                <div style={{ color: 'var(--red)', fontSize: 16 }}>↗</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: '#000', padding: '32px clamp(24px,6vw,120px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)' }}>AAD</div>
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'var(--muted)', letterSpacing: '0.2em' }}>© 2025 AARYAN ADITYA DAS — ALL RIGHTS RESERVED</div>
      <div style={{ display: 'flex', gap: 20 }}>
        {[{ l: 'IG', u: SOCIALS.instagram }, { l: 'LI', u: SOCIALS.linkedin }, { l: 'GH', u: SOCIALS.github }, { l: 'EM', u: `mailto:${SOCIALS.email}` }].map(s => (
          <a key={s.l} href={s.u} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'var(--muted)', textDecoration: 'none', letterSpacing: '0.2em', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
            {s.l}
          </a>
        ))}
      </div>
    </footer>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const onDone = useCallback(() => setLoaded(true), []);
  return (
    <>
      <CursorGlow />
      {!loaded && <Loader onDone={onDone} />}
      <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.8s ease', background: 'var(--black)' }}>
        <Nav />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <GitHub />
        <Timeline />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
