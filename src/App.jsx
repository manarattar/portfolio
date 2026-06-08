import { useState, useEffect, useRef } from 'react'

function useTypewriter(words, typeSpeed = 75, deleteSpeed = 40, pauseMs = 1800) {
  const [display, setDisplay] = useState('')
  const [idx, setIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    const word = words[idx % words.length]
    let t
    if (!deleting && display === word) {
      t = setTimeout(() => setDeleting(true), pauseMs)
    } else if (deleting && display === '') {
      setDeleting(false)
      setIdx(i => i + 1)
    } else {
      t = setTimeout(() => {
        setDisplay(deleting ? word.slice(0, display.length - 1) : word.slice(0, display.length + 1))
      }, deleting ? deleteSpeed : typeSpeed)
    }
    return () => clearTimeout(t)
  }, [display, idx, deleting, words, typeSpeed, deleteSpeed, pauseMs])
  return display
}

function useFadeIn() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  const style = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(28px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
  }
  return { ref, style }
}

const NAV_LINKS = ['Projects', 'Research', 'Experience', 'Skills', 'Contact']

const AI_PROJECTS = [
  {
    title: 'AI Contract Risk Analyzer',
    desc: 'Upload contracts (PDF/DOCX/TXT), get clause-level risk scores, suggested revisions, Q&A chat, and PDF report export.',
    tags: ['FastAPI', 'ChromaDB', 'OpenAI', 'React'],
    status: 'Live on Render',
    badge: { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: 'rgba(139,92,246,0.25)' },
    github: 'https://github.com/manarattar/contract-risk-analyzer',
    demo: 'https://contracts.manarattar.com',
    preview: '/preview-contract-analyzer.gif',
  },
  {
    title: 'Multi-Agent Research Assistant',
    desc: '5-agent pipeline that produces structured research reports with live SSE streaming and follow-up Q&A.',
    tags: ['Agentic AI', 'FastAPI', 'Groq', 'Tavily', 'SSE', 'React'],
    status: 'Live on Render',
    badge: { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: 'rgba(139,92,246,0.25)' },
    github: 'https://github.com/manarattar/multi-agent-researcher',
    demo: 'https://researcher.manarattar.com',
    preview: '/preview-researcher.gif',
  },
  {
    title: 'Munazara — AI Debate Engine',
    desc: 'Full-stack debate platform: watch AI argue both sides of any topic, or challenge the AI yourself. Features live streaming, RAG-sourced evidence, real-time fact-checking, a vote system, leaderboard, and an interactive knowledge graph of all debates.',
    tags: ['FastAPI', 'gpt-4o-mini', 'Tavily', 'ChromaDB', 'React', 'SSE'],
    status: 'Live on Vercel',
    badge: { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: 'rgba(139,92,246,0.25)' },
    github: 'https://github.com/manarattar/debate-engine',
    demo: 'https://munazara.manarattar.com',
    preview: '/preview-debate-engine.gif',
  },
  {
    title: 'RivalScan: Competitor Intelligence Dashboard',
    desc: 'Track competitor product updates in real time — RSS feeds, GitHub releases, and changelogs aggregated, AI-summarised, and scored by business impact.',
    tags: ['FastAPI', 'OpenAI', 'SQLAlchemy', 'React', 'Vite'],
    status: 'Live on Render',
    badge: { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: 'rgba(139,92,246,0.25)' },
    github: 'https://github.com/manarattar/rival-scan',
    demo: 'https://rivals.manarattar.com',
    preview: '/preview-rival-scan.gif',
  },
  {
    title: 'SwipeEat: Adaptive Meal Recommendation',
    desc: 'Preference-based recommendation algorithm matching users with meals via an intuitive swipe-driven UI. Built for Vervai as a mobile web app MVP.',
    tags: ['Python', 'JavaScript', 'Flask', 'HTML/CSS'],
    status: 'Live on Render',
    badge: { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: 'rgba(139,92,246,0.25)' },
    github: null,
    demo: 'https://swipeat.manarattar.com',
    preview: '/preview-swipeat.gif',
  },
]

const ACADEMIC_PROJECTS = [
  {
    title: 'LINKED4RESILIENCE: Geo-Data for Crisis Response',
    desc: 'Data pipelines for cleaning and visualising geo-annotated crisis datasets. Linked Data methodology for data unification and integration.',
    tags: ['Python', 'RDF', 'SPARQL', 'Ontology', 'Geodata'],
    result: 'Published at ACM SIGSPATIAL 2023',
    highlight: true,
    demo: 'https://linked4resilience.eu/',
  },
  {
    title: 'Emotion & Sentiment Analysis (HLT)',
    desc: 'Sentiment and emotion classification using baseline methods and optimised SVMs on conversational and social media text. TF-IDF feature engineering with error analysis under class imbalance.',
    tags: ['Python', 'NLP', 'SVM', 'Text Mining', 'scikit-learn'],
    result: 'Competitive classification under imbalanced datasets',
  },
  {
    title: 'World Cup Twitter Sentiment Analysis',
    desc: 'Sentiment analysis using ML and rule-based approaches, with topic classification and named entity recognition on unstructured tweet data.',
    tags: ['Python', 'NLP', 'ML', 'Topic Classification', 'NER'],
    result: 'Sentiment analysis framework for NLP workflows',
  },
  {
    title: 'Predicting Annual Income',
    desc: 'Addressed class imbalance in income prediction via random oversampling and synthetic data generation (SMOTE). Full data distribution analysis.',
    tags: ['Python', 'SMOTE', 'ML', 'Data Processing'],
    result: 'Improved accuracy and robustness of predictive models',
  },
  {
    title: 'Cooking Assistant Chatbot',
    desc: 'Conversational agent delivering step-by-step cooking instructions. Designed for intuitive user interaction in practical kitchen scenarios.',
    tags: ['Conversational AI', 'NLP', 'Dialogue Systems'],
    result: 'Intuitive cooking assistant with natural dialogue flow',
  },
]

const EXPERIENCE = [
  {
    role: 'AI Consultant',
    company: 'Vervai',
    period: 'Apr 2024 – Present',
    points: [
      'Designed and implemented AI solutions focusing on practical applications and innovation.',
      'Organised and led AI workshops and training sessions to bridge theory and practice.',
    ],
  },
  {
    role: 'Innovation Consultant',
    company: 'Daffee',
    period: 'Jun 2024 – Sep 2025',
    points: [
      'Created role-specific GPT assistants to enhance productivity and decision-making.',
      'Built semi-automated workflows in marketing, sales, and operations to reduce manual tasks.',
    ],
  },
]

const EDUCATION = [
  { degree: "Master's in Language & AI", school: 'Vrije Universiteit Amsterdam', period: 'Sep 2025 – Present' },
  { degree: 'Amsterdam Startup Launch Program', school: 'Vrije Universiteit Amsterdam', period: 'Sep 2024 – Jan 2025' },
  { degree: 'BSc Artificial Intelligence', school: 'Vrije Universiteit Amsterdam', period: 'Sep 2020 – Aug 2023' },
]

const SKILLS = [
  { group: 'AI & ML', items: ['Python', 'PyTorch', 'HuggingFace', 'BERT/DistilBERT', 'LLaMA/Ollama', 'Agentic AI', 'Multi-Agent Systems', 'Prompt Engineering', 'RAG', 'ChromaDB', 'scikit-learn'] },
  { group: 'Backend', items: ['FastAPI', 'Flask', 'SQLAlchemy', 'Pydantic', 'SSE Streaming', 'REST APIs', 'SQLite/PostgreSQL', 'Firebase', 'Docker'] },
  { group: 'Frontend & Data', items: ['React', 'Vite', 'Tailwind CSS', 'JavaScript', 'HTML/CSS', 'Axios', 'pandas', 'NumPy', 'matplotlib', 'seaborn'] },
  { group: 'Tools', items: ['Git', 'GitHub', 'Jupyter', 'MATLAB', 'R', 'SQL', 'Render', 'VS Code', 'Excel'] },
]

const PUBLICATIONS = [
  {
    title: 'Converting and Enriching Geoannotated Event Data: Integrating Information for Ukraine Resilience',
    venue: 'ACM SIGSPATIAL International Conference, November 13–16, 2023',
    authors: 'M. Attar, S. Wang, R. Siebes, E. Kultorp',
  },
  {
    title: 'Using Integrated and Enriched Linked Data for Ukraine Resilience',
    venue: 'BNAIC 2023 Conference, November 8–10, 2023',
    authors: 'M. Attar, S. Wang, R. Siebes, E. Kultorp',
  },
]

const GH = (
  <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const C = { width: '100%', maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px,4vw,48px)', boxSizing: 'border-box' }
const SEC = { padding: '72px 0' }
const CARD = { background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16 }

export default function App() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const typedText = useTypewriter(['AI Researcher', 'NLP Engineer', 'Agentic Systems Developer', 'LLM Specialist', 'RAG Architect'])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const go = id => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setOpen(false) }

  return (
    <div style={{ background: '#0a0e1a', color: '#e2e8f0', fontFamily: 'system-ui,sans-serif' }}>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'background .3s', ...(scrolled ? { background: 'rgba(10,14,26,.93)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(255,255,255,.06)' } : {}) }}>
        <div style={{ ...C, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <span style={{ fontWeight: 700, fontSize: 17, background: 'linear-gradient(to right,#818cf8,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Manar Attar
          </span>
          <div className="nav-desktop" style={{ alignItems: 'center', gap: 24 }}>
            {NAV_LINKS.map(l => (
              <button key={l} onClick={() => go(l.toLowerCase())} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 14, cursor: 'pointer' }}
                onMouseEnter={e => e.target.style.color = '#f1f5f9'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>
                {l}
              </button>
            ))}
            <a href="/Manar-Attar-CV.pdf" download style={{ fontSize: 13, padding: '7px 16px', borderRadius: 8, border: '1px solid rgba(99,102,241,.45)', color: '#818cf8', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              Download CV
            </a>
          </div>
          <button className="nav-mobile" onClick={() => setOpen(o => !o)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 6, display: 'none' }}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
        {open && (
          <div style={{ background: '#0d1120', borderTop: '1px solid rgba(255,255,255,.06)', padding: '12px 24px 16px' }}>
            {NAV_LINKS.map(l => (
              <button key={l} onClick={() => go(l.toLowerCase())} style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#cbd5e1', fontSize: 15, padding: '10px 0', cursor: 'pointer' }}>
                {l}
              </button>
            ))}
            <a href="/Manar-Attar-CV.pdf" download style={{ display: 'block', color: '#818cf8', fontSize: 15, padding: '10px 0', textDecoration: 'none' }}>Download CV</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 120, paddingBottom: 80, position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse,rgba(99,102,241,.13),transparent 70%)', filter: 'blur(30px)' }} />
        </div>
        <div style={{ ...C, textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, border: '1px solid rgba(99,102,241,.3)', background: 'rgba(99,102,241,.08)', color: '#a5b4fc', fontSize: 13, marginBottom: 24 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#818cf8', animation: 'pulse 2s infinite' }} />
            Open to opportunities
          </div>
          <h1 style={{ fontWeight: 800, lineHeight: 1.15, margin: '0 0 14px', fontSize: 'clamp(2.1rem,5vw,3.8rem)' }}>
            <span style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Manar Attar
            </span>
          </h1>
          <p style={{ fontSize: 'clamp(1.1rem,2.5vw,1.5rem)', color: '#a78bfa', fontWeight: 600, margin: '0 0 18px', minHeight: '2em' }}>
            {typedText}<span className="cursor">|</span>
          </p>
          <p style={{ maxWidth: 580, margin: '0 auto 32px', color: '#94a3b8', lineHeight: 1.8, fontSize: 15 }}>
            AI Researcher and Developer specialising in agentic architectures, RAG pipelines,
            and fine-tuned NLP models. Pursuing a Master's in Language &amp; AI at Vrije Universiteit
            Amsterdam, with thesis research on author profiling in multilingual hate speech data —
            benchmarking zero-shot LLMs against fine-tuned BERT models.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
            <button onClick={() => go('projects')} style={{ padding: '11px 26px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              View Projects
            </button>
            <a href="/Manar-Attar-CV.pdf" download style={{ padding: '11px 26px', borderRadius: 10, border: '1px solid rgba(100,116,139,.5)', color: '#cbd5e1', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              Download CV
            </a>
            <a href="https://github.com/manarattar" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 26px', borderRadius: 10, border: '1px solid rgba(100,116,139,.5)', color: '#cbd5e1', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              {GH} GitHub
            </a>
            <a href="https://linkedin.com/in/manar-attar" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 26px', borderRadius: 10, border: '1px solid rgba(100,116,139,.5)', color: '#cbd5e1', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              LinkedIn
            </a>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32 }}>
            {[['5', 'AI Portfolio Projects'], ['6', 'Academic Projects'], ['2', 'Publications']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#818cf8' }}>{v}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI PROJECTS */}
      <section id="projects" style={SEC}>
        <Fade><div style={C}>
          <Hdr label="Portfolio" title="AI Projects" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,320px),1fr))', gap: 20 }}>
            {AI_PROJECTS.map(p => (
              <div key={p.title} className="glow-wrap">
                <div className="glow-inner" style={{ display: 'flex', flexDirection: 'column' }}>
                  {p.preview && (
                    <div style={{ width: '100%', height: 160, overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                      <img src={p.preview} alt={`${p.title} preview`} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                    </div>
                  )}
                  <div style={{ padding: '18px 20px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 999, background: p.badge.bg, color: p.badge.color, border: `1px solid ${p.badge.border}`, marginBottom: 12, alignSelf: 'flex-start' }}>
                      {p.status}
                    </span>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: '0 0 8px', lineHeight: 1.4 }}>{p.title}</h3>
                    <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, margin: '0 0 14px', flex: 1 }}>{p.desc}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                      {p.tags.map(t => <span key={t} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'rgba(30,41,59,.9)', color: '#94a3b8' }}>{t}</span>)}
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {p.github
                        ? <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: 'center', fontSize: 13, padding: '8px', borderRadius: 8, border: '1px solid rgba(71,85,105,.6)', color: '#94a3b8', textDecoration: 'none' }}>GitHub</a>
                        : <span style={{ flex: 1, textAlign: 'center', fontSize: 13, padding: '8px', borderRadius: 8, border: '1px solid rgba(71,85,105,.3)', color: '#475569' }}>Private</span>
                      }
                      {p.demo
                        ? <a href={p.demo} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: 'center', fontSize: 13, padding: '8px', borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', textDecoration: 'none' }}>Live Demo</a>
                        : <span style={{ flex: 1, textAlign: 'center', fontSize: 13, padding: '8px', borderRadius: 8, border: '1px solid rgba(71,85,105,.3)', color: '#475569' }}>No demo</span>
                      }
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div></Fade>
      </section>

      {/* ACADEMIC PROJECTS */}
      <section style={SEC}>
        <Fade><div style={C}>
          <Hdr label="Bachelor & Master" title="Academic Projects" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,320px),1fr))', gap: 16 }}>
            {ACADEMIC_PROJECTS.map(p => (
              <div key={p.title} style={{ ...CARD, padding: '20px', border: p.highlight ? '1px solid rgba(99,102,241,.3)' : CARD.border }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', margin: '0 0 8px', lineHeight: 1.4 }}>{p.title}</h3>
                <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, margin: '0 0 12px' }}>{p.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                  {p.tags.map(t => <span key={t} style={{ fontSize: 11, padding: '3px 7px', borderRadius: 6, background: 'rgba(30,41,59,.9)', color: '#94a3b8' }}>{t}</span>)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 12, color: p.highlight ? '#a5b4fc' : '#64748b', display: 'flex', alignItems: 'center', gap: 5 }}>
                    {p.highlight && <span style={{ color: '#818cf8' }}>★</span>}
                    {p.result}
                  </div>
                  {p.demo && (
                    <a href={p.demo} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, padding: '4px 12px', borderRadius: 7, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div></Fade>
      </section>

      {/* RESEARCH */}
      <section id="research" style={SEC}>
        <Fade><div style={C}>
          <Hdr label="Master's Thesis · VU Amsterdam · 2026" title="Current Research" />
          <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden' }}>
            {/* glow backdrop */}
            <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(99,102,241,.09) 0%,rgba(139,92,246,.06) 50%,rgba(192,132,252,.04) 100%)', borderRadius: 24 }} />
            <div style={{ position: 'relative', border: '1px solid rgba(99,102,241,.25)', borderRadius: 24, padding: 'clamp(24px,5vw,48px)' }}>

              {/* status row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '5px 13px', borderRadius: 999, background: 'rgba(99,102,241,.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,.35)', fontWeight: 700, letterSpacing: '0.03em' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#818cf8', animation: 'pulse 2s infinite' }} />
                  In Progress — Due June 2026
                </span>
              </div>

              {/* title */}
              <h3 style={{ fontSize: 'clamp(1.2rem,2.8vw,1.7rem)', fontWeight: 800, color: '#f1f5f9', margin: '0 0 6px', textAlign: 'center', letterSpacing: '-0.01em' }}>
                Author Profiling on Hate Speech Data
              </h3>
              <p style={{ textAlign: 'center', fontSize: 13, color: '#6366f1', fontWeight: 600, margin: '0 0 20px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Zero-shot LLMs vs. Fine-tuned Encoder Models
              </p>

              {/* research question callout */}
              <div style={{ maxWidth: 680, margin: '0 auto 28px', background: 'rgba(99,102,241,.07)', border: '1px solid rgba(99,102,241,.2)', borderRadius: 14, padding: '16px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Research Question</p>
                <p style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
                  "Can zero-shot large language models match or surpass fine-tuned BERT models
                  in predicting the gender and age group of hate speech authors across languages?"
                </p>
              </div>

              {/* description */}
              <p style={{ maxWidth: 660, margin: '0 auto 28px', color: '#94a3b8', fontSize: 14, lineHeight: 1.8, textAlign: 'center' }}>
                This thesis evaluates two paradigms against the multilingual <strong style={{ color: '#cbd5e1' }}>LiLaH dataset</strong> (9,600+ records across English, Croatian, Dutch &amp; Slovenian):
                zero-shot inference with <strong style={{ color: '#cbd5e1' }}>LLaMA-3 &amp; Qwen</strong> versus encoder models
                (<strong style={{ color: '#cbd5e1' }}>BERT &amp; DistilBERT</strong>) fine-tuned on the cross-domain <strong style={{ color: '#cbd5e1' }}>PAN14</strong> corpus.
              </p>

              {/* stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,190px),1fr))', gap: 12, marginBottom: 24 }}>
                {[
                  { icon: '🗂️', label: 'Dataset', value: 'LiLaH + PAN14' },
                  { icon: '🤖', label: 'Models', value: 'BERT · DistilBERT · LLaMA-3 · Qwen' },
                  { icon: '🌍', label: 'Languages', value: 'EN · HR · NL · SL' },
                  { icon: '📅', label: 'Status', value: 'Analysis in progress · Results due June 2026' },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 14, padding: '14px 16px' }}>
                    <div style={{ fontSize: 18, marginBottom: 6 }}>{icon}</div>
                    <div style={{ fontSize: 10, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.4, fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
                {['NLP', 'Author Profiling', 'Hate Speech Detection', 'LLMs', 'BERT', 'Zero-shot Inference', 'Fine-tuning', 'Cross-dataset Evaluation', 'Demographic Prediction'].map(t => (
                  <span key={t} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 999, background: 'rgba(99,102,241,.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,.2)' }}>{t}</span>
                ))}
              </div>

            </div>
          </div>
        </div></Fade>
      </section>

      {/* EXPERIENCE + EDUCATION */}
      <section id="experience" style={SEC}>
        <Fade><div style={C}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,480px),1fr))', gap: 40 }}>
            {/* Work */}
            <div>
              <Hdr label="Career" title="Work Experience" left />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {EXPERIENCE.map(e => (
                  <div key={e.company} style={{ ...CARD, padding: '20px 22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                      <div>
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{e.role}</span>
                        <span style={{ fontSize: 14, color: '#818cf8', marginLeft: 8 }}>@ {e.company}</span>
                      </div>
                      <span style={{ fontSize: 12, color: '#64748b' }}>{e.period}</span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {e.points.map(pt => <li key={pt} style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{pt}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            {/* Education */}
            <div>
              <Hdr label="Academic" title="Education" left />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {EDUCATION.map(e => (
                  <div key={e.degree} style={{ ...CARD, padding: '20px 22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{e.degree}</span>
                      <span style={{ fontSize: 12, color: '#64748b' }}>{e.period}</span>
                    </div>
                    <span style={{ fontSize: 13, color: '#818cf8' }}>{e.school}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div></Fade>
      </section>

      {/* SKILLS */}
      <section id="skills" style={SEC}>
        <Fade><div style={C}>
          <Hdr label="Technical" title="Skills & Tools" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,240px),1fr))', gap: 16, marginBottom: 16 }}>
            {SKILLS.map(s => (
              <div key={s.group} style={{ ...CARD, padding: '20px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>{s.group}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {s.items.map(i => <span key={i} style={{ fontSize: 12, padding: '4px 8px', borderRadius: 6, background: 'rgba(30,41,59,.9)', color: '#cbd5e1' }}>{i}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ ...CARD, padding: '20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Languages</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[['English', 'Fluent'], ['Arabic', 'Native'], ['Dutch', 'Advanced · B2']].map(([l, lvl]) => (
                <div key={l} style={{ fontSize: 13, padding: '6px 14px', borderRadius: 8, background: 'rgba(30,41,59,.9)', color: '#cbd5e1', border: '1px solid rgba(71,85,105,.4)' }}>
                  {l} <span style={{ color: '#64748b', fontSize: 12 }}>· {lvl}</span>
                </div>
              ))}
            </div>
          </div>
        </div></Fade>
      </section>

      {/* PUBLICATIONS */}
      <section style={SEC}>
        <Fade><div style={C}>
          <Hdr label="Research Output" title="Publications" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {PUBLICATIONS.map(p => (
              <div key={p.title} style={{ ...CARD, padding: '20px 24px', borderLeft: '3px solid #6366f1' }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', margin: '0 0 6px', lineHeight: 1.5 }}>{p.title}</p>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 4px' }}>{p.authors}</p>
                <p style={{ fontSize: 12, color: '#6366f1', margin: 0 }}>{p.venue}</p>
              </div>
            ))}
          </div>
        </div></Fade>
      </section>

      {/* CONTACT */}
      <section id="contact" style={SEC}>
        <Fade><div style={C}>
          <Hdr label="Get In Touch" title="Contact" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,460px),1fr))', gap: 40, alignItems: 'start' }}>

            {/* Left — blurb + links */}
            <div>
              <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.8, margin: '0 0 28px' }}>
                Finishing my Master's thesis — open to AI/ML roles from mid-2026.
                Reach out for collaborations, opportunities, or just to talk AI.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { href: 'mailto:manarattar77@gmail.com', label: 'manarattar77@gmail.com', icon: '✉️' },
                  { href: 'https://linkedin.com/in/manar-attar', label: 'linkedin.com/in/manar-attar', icon: '💼', blank: true },
                  { href: 'https://github.com/manarattar', label: 'github.com/manarattar', icon: '🐙', blank: true },
                ].map(({ href, label, icon, blank }) => (
                  <a key={label} href={href} {...(blank ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', color: '#94a3b8', textDecoration: 'none', fontSize: 14, transition: 'border-color .2s, color .2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,.4)'; e.currentTarget.style.color = '#f1f5f9' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.07)'; e.currentTarget.style.color = '#94a3b8' }}>
                    <span style={{ fontSize: 16 }}>{icon}</span>{label}
                  </a>
                ))}
                <a href="/Manar-Attar-CV.pdf" download
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 24px', borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none', marginTop: 4 }}>
                  Download CV
                </a>
              </div>
            </div>

            {/* Right — contact form */}
            <ContactForm />
          </div>
        </div></Fade>
      </section>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,.05)', padding: '20px 24px', textAlign: 'center', color: '#475569', fontSize: 13 }}>
        © 2026 Manar Attar · React &amp; Tailwind CSS
      </footer>

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes spin-border{to{transform:rotate(360deg)}}

        .cursor{animation:blink 1s step-end infinite;color:#6366f1;font-weight:300}

        .glow-wrap{
          position:relative;border-radius:17px;overflow:hidden;
          padding:1px;background:rgba(255,255,255,.07);
          display:flex;flex-direction:column;
        }
        .glow-wrap::before{
          content:'';position:absolute;
          width:200%;height:200%;top:-50%;left:-50%;
          background:conic-gradient(from 0deg,transparent 0%,#6366f1 25%,#a78bfa 50%,#c084fc 62%,transparent 75%);
          animation:spin-border 2.5s linear infinite;
          opacity:0;transition:opacity 0.4s ease;
          z-index:0;
        }
        .glow-wrap:hover::before{opacity:1}
        .glow-inner{
          position:relative;z-index:1;
          border-radius:16px;background:#0d1220;
          flex:1;overflow:hidden;
        }

        .nav-desktop{display:flex}
        .nav-mobile{display:none}
        @media(max-width:680px){
          .nav-desktop{display:none!important}
          .nav-mobile{display:block!important}
        }
      `}</style>
    </div>
  )
}

const WEB3FORMS_KEY = '7ec7a12f-ef4e-4deb-b491-a8703fb92065'

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_key: WEB3FORMS_KEY, ...form }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch { setStatus('error') }
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14,
    background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)',
    color: '#f1f5f9', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color .2s',
  }

  if (status === 'success') return (
    <div style={{ ...CARD, padding: '40px 32px', textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
      <p style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', margin: '0 0 8px' }}>Message sent!</p>
      <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 24px' }}>I'll get back to you soon.</p>
      <button onClick={() => { setForm({ name: '', email: '', message: '' }); setStatus('idle') }}
        style={{ padding: '9px 22px', borderRadius: 8, border: '1px solid rgba(99,102,241,.4)', background: 'transparent', color: '#818cf8', fontSize: 14, cursor: 'pointer' }}>
        Send another
      </button>
    </div>
  )

  return (
    <form onSubmit={submit} style={{ ...CARD, padding: '28px 28px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 600, letterSpacing: '0.05em' }}>NAME</label>
          <input required value={form.name} onChange={set('name')} placeholder="Jane Smith" style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,.6)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,.1)'} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 600, letterSpacing: '0.05em' }}>EMAIL</label>
          <input required type="email" value={form.email} onChange={set('email')} placeholder="jane@company.com" style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,.6)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,.1)'} />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 600, letterSpacing: '0.05em' }}>MESSAGE</label>
        <textarea required value={form.message} onChange={set('message')} placeholder="Hi Manar, I'd love to discuss..." rows={5}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
          onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,.6)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,.1)'} />
      </div>
      {status === 'error' && <p style={{ fontSize: 13, color: '#f87171', margin: 0 }}>Something went wrong — try emailing directly.</p>}
      <button type="submit" disabled={status === 'sending'}
        style={{ padding: '12px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 600, fontSize: 15, cursor: status === 'sending' ? 'not-allowed' : 'pointer', opacity: status === 'sending' ? 0.7 : 1, transition: 'opacity .2s' }}>
        {status === 'sending' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}

function Fade({ children, delay = 0 }) {
  const { ref, style } = useFadeIn()
  return (
    <div ref={ref} style={{ ...style, transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function Hdr({ label, title, left }) {
  return (
    <div style={{ textAlign: left ? 'left' : 'center', marginBottom: 32 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px' }}>{label}</p>
      <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>{title}</h2>
    </div>
  )
}
