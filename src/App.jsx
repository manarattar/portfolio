import { useState, useEffect, useRef } from 'react'
import AssistantWidget from './components/AssistantWidget.jsx'
import Icon from './components/Icon'

function useRotator(words, intervalMs = 2600) {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const fadeOut = setTimeout(() => setVisible(false), intervalMs - 250)
    const next = setTimeout(() => { setIdx(i => (i + 1) % words.length); setVisible(true) }, intervalMs)
    return () => { clearTimeout(fadeOut); clearTimeout(next) }
  }, [idx, words.length, intervalMs])
  return { word: words[idx], visible }
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') return 'light'
    const attr = document.documentElement.getAttribute('data-theme')
    if (attr === 'light' || attr === 'dark') return attr
    return 'light'
  })
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    try { localStorage.setItem('theme', next) } catch {}
  }
  return { theme, toggle }
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
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
  }
  return { ref, style }
}

const NAV_LINKS = ['Projects', 'Research', 'Experience', 'Skills', 'Contact']

const AI_PROJECTS = [
  {
    title: 'Routing Slip: A Process in Plain Words, Run on a Real Inbox',
    category: 'Agentic Workflow',
    desc: 'Describe a business process in plain words and watch it become a live workflow. Each step is routed to the tool that fits: code for rules, Jev for judgment calls, an LLM only where text must be written. A person steps in whenever Jev isn\'t confident enough.',
    tags: ['Agentic AI', 'Jev (TypeSafe)', 'FastAPI', 'React Flow', 'SSE', 'OpenAI', 'Docker'],
    github: 'https://github.com/manarattar/workflow-studio',
    demo: 'https://studio.manarattar.com',
    logo: '/logos/routing-slip.png',
  },
  {
    title: 'Proofline: Agentic Risk Assessment, Explained',
    category: 'Agentic Risk AI',
    desc: 'Watch an AI agent find evidence in a document, verify it\'s real against the source, then compute a risk score by formula, never by asking the model directly. An LLM finds quotes; Jev rates severity and likelihood with a confidence score, flagging anything uncertain for a person to review.',
    tags: ['Agentic AI', 'Jev (TypeSafe)', 'FastAPI', 'React', 'SSE', 'OpenAI', 'Docker'],
    github: 'https://github.com/manarattar/argus-lite',
    demo: 'https://argusv1.manarattar.com',
    logo: '/logos/proofline.png',
  },
  {
    title: 'ARGUS: Agentic Risk Governance System',
    category: 'Agentic Risk AI',
    desc: 'Decision-support for financial-risk analysts. An eight-step agentic workflow investigates a counterparty case file, ties every finding to a cited source passage, tests it against policy, argues against its own conclusions, and computes an explainable rating by arithmetic. It then stops at a human review gate: the AI recommends, an analyst decides. Includes an evidence graph, a scenario lab and a 53-case evaluation suite.',
    tags: ['Agentic AI', 'FastAPI', 'Next.js', 'RAG', 'pgvector', 'Docker'],
    github: 'https://github.com/manarattar/argus',
    demo: 'https://argus.manarattar.com',
    logo: '/logos/argus.png',
  },
  {
    title: 'TelecomNL Voice AI Assistant',
    category: 'Voice AI',
    desc: 'Full-stack voice AI customer-support agent: speak your issue, hear Sarah respond in real time. Whisper STT, GPT-4o tool-calling with live diagnostics, ElevenLabs TTS, multi-agent personas, a sentiment timeline, and a hands-free voice-activity mode.',
    tags: ['FastAPI', 'GPT-4o', 'Whisper', 'ElevenLabs', 'Web Audio API', 'SSE'],
    github: 'https://github.com/manarattar/telecom-voice-assistant',
    demo: 'https://voice.manarattar.com',
    logo: '/logos/telecom-voice.png',
  },
  {
    title: 'AI Contract Risk Analyzer',
    category: 'Document AI',
    desc: 'Upload a contract and get clause-level risk scores, suggested revisions, a Q&A chat, and a PDF report. Jev classifies each clause with a probability per risk category, so the score is computed from those probabilities (not picked by an AI), and an LLM only writes the explanations.',
    tags: ['FastAPI', 'Jev (TypeSafe)', 'ChromaDB', 'OpenAI', 'React'],
    github: 'https://github.com/manarattar/contract-risk-analyzer',
    demo: 'https://contracts.manarattar.com',
    logo: '/logos/contract-analyzer.png',
  },
  {
    title: 'Multi-Agent Research Assistant',
    category: 'Agentic Research',
    desc: 'A five-agent pipeline that decomposes a research question, searches the web with Tavily, and synthesizes sources into a structured report, streamed live over SSE as each agent finishes its stage, with follow-up Q&A once the report is done.',
    tags: ['Agentic AI', 'FastAPI', 'Groq', 'Tavily', 'SSE', 'React'],
    github: 'https://github.com/manarattar/multi-agent-researcher',
    demo: 'https://researcher.manarattar.com',
    logo: '/logos/research-assistant.png',
  },
  {
    title: 'Munazara: AI Debate Engine',
    category: 'Agentic NLP',
    desc: 'Watch AI argue both sides of any topic, or challenge it yourself, with evidence pulled live via RAG and fact-checked in real time. Includes a voting system, a leaderboard, and an interactive knowledge graph connecting every debate on the platform.',
    tags: ['FastAPI', 'gpt-4o-mini', 'Tavily', 'ChromaDB', 'React', 'SSE'],
    github: 'https://github.com/manarattar/debate-engine',
    demo: 'https://munazara.manarattar.com',
    logo: '/logos/debate-engine.png',
  },
  {
    title: 'RivalScan: Competitor Intelligence Dashboard',
    category: 'Data Intelligence',
    desc: 'Tracks competitor product updates in real time: RSS feeds, GitHub releases, and changelogs aggregated automatically, summarised by AI, and scored by business impact so the updates that matter surface first, not the noise.',
    tags: ['FastAPI', 'OpenAI', 'SQLAlchemy', 'React', 'Vite'],
    github: 'https://github.com/manarattar/rival-scan',
    demo: 'https://rivals.manarattar.com',
    logo: '/logos/rivalscan.png',
  },
  {
    title: 'SwipeEat: Adaptive Meal Recommendation',
    category: 'ML Product',
    desc: 'A preference-based recommendation engine matching people to meals through an intuitive swipe-driven interface, learning what someone likes with every swipe. Built for Vervai as a mobile web app MVP, from concept to a working, demo-ready product.',
    tags: ['Python', 'JavaScript', 'Flask', 'HTML/CSS'],
    github: null,
    demo: 'https://swipeat.manarattar.com',
    logo: '/logos/swipeeat.png',
  },
]

const [FEATURED_PROJECT, ...OTHER_PROJECTS] = AI_PROJECTS

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
  { degree: "Master's in Language & AI", school: 'Vrije Universiteit Amsterdam', period: 'Sep 2025 – Dec 2026 (expected)' },
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

const THESIS_SCORES = [
  { metric: 'Gender · macro F1', llm: 0.515, bert: 0.488 },
  { metric: 'Age group · macro F1', llm: 0.211, bert: 0.310 },
]

const GH = (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const LI = (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

export default function App() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggle: toggleTheme } = useTheme()
  const { word: role, visible: roleVisible } = useRotator(['AI Engineer', 'LLM & RAG Engineer', 'NLP Engineer', 'Agentic Systems Developer'])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const go = id => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setOpen(false) }

  return (
    <div className="bg-paper text-ink font-sans">

      {/* NAV */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-colors ${scrolled ? 'bg-paper/95 backdrop-blur border-b border-line' : ''}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-ink">Manar Attar</span>
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(l => (
              <button key={l} onClick={() => go(l.toLowerCase())}
                className="font-mono text-xs uppercase tracking-wide text-ink-dim hover:text-ink transition-colors">
                {l}
              </button>
            ))}
            <a href="/Manar-Attar-CV.pdf" download
              className="font-mono text-xs uppercase tracking-wide px-4 py-2 border border-accent/50 text-accent hover:bg-accent/10 transition-colors">
              Download CV
            </a>
            <button onClick={toggleTheme} aria-label="Toggle color theme"
              className="w-8 h-8 flex items-center justify-center border border-line text-ink-dim hover:text-ink hover:border-ink-dim transition-colors">
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={15} />
            </button>
          </div>
          <div className="md:hidden flex items-center gap-3">
            <button onClick={toggleTheme} aria-label="Toggle color theme"
              className="w-8 h-8 flex items-center justify-center border border-line text-ink-dim">
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={15} />
            </button>
            <button onClick={() => setOpen(o => !o)} className="text-ink-dim p-1" aria-label="Toggle menu">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden bg-paper border-t border-line px-6 py-4">
            {NAV_LINKS.map(l => (
              <button key={l} onClick={() => go(l.toLowerCase())}
                className="block w-full text-left font-mono text-sm uppercase tracking-wide text-ink-dim py-2.5">
                {l}
              </button>
            ))}
            <a href="/Manar-Attar-CV.pdf" download className="block text-accent font-mono text-sm py-2.5">Download CV</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="pt-36 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-faint mb-6">
            <span className="text-accent">·</span> Available now · Netherlands
          </p>
          <h1 className="font-display font-semibold text-ink leading-tight mb-4 text-[clamp(2.4rem,6vw,4rem)]">
            Manar Attar
          </h1>
          <p className="h-8 font-mono text-base text-accent mb-6 transition-opacity duration-300" style={{ opacity: roleVisible ? 1 : 0 }}>
            {role}
          </p>
          <p className="text-ink-dim leading-relaxed mb-10 max-w-xl mx-auto">
            AI Engineer who ships products end to end, from idea to production. I design, build
            and deploy AI solutions across generative AI, agentic systems and NLP, and every
            project below is live.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            <button onClick={() => go('projects')}
              className="px-6 py-3 bg-accent text-paper font-medium text-sm hover:bg-accent-dim transition-colors">
              View Projects
            </button>
            <a href="/Manar-Attar-CV.pdf" download
              className="px-6 py-3 border border-line text-ink font-medium text-sm hover:border-ink-dim transition-colors">
              Download CV
            </a>
            <a href="https://github.com/manarattar" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 border border-line text-ink font-medium text-sm hover:border-ink-dim transition-colors">
              {GH} GitHub
            </a>
            <a href="https://linkedin.com/in/manar-attar" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 border border-line text-ink font-medium text-sm hover:border-ink-dim transition-colors">
              {LI} LinkedIn
            </a>
          </div>
          <div className="flex justify-center gap-10">
            {[[AI_PROJECTS.length, 'AI Portfolio Projects'], [ACADEMIC_PROJECTS.length, 'Academic Projects'], [PUBLICATIONS.length, 'Publications']].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="font-display text-2xl font-semibold text-ink">{v}</div>
                <div className="font-mono text-[11px] uppercase tracking-wide text-ink-faint mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI PROJECTS */}
      <section id="projects" className="py-20 border-t border-line">
        <Fade><div className="max-w-6xl mx-auto px-4 sm:px-8">
          <Hdr label="Portfolio" title="AI Projects" />

          {/* Featured */}
          <div className="border border-line bg-paper-raised p-6 sm:p-10 mb-6">
            <div className="flex items-start gap-5 mb-4">
              <img src={FEATURED_PROJECT.logo} alt="" className="w-20 h-20 shrink-0 rounded-xl" />
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-accent mb-1.5">
                  Featured <span className="text-ink-faint">·</span> {FEATURED_PROJECT.category}
                </p>
                <h3 className="font-display text-2xl font-semibold text-ink leading-snug">{FEATURED_PROJECT.title}</h3>
              </div>
            </div>
            <p className="text-ink-dim leading-relaxed mb-6 max-w-3xl">{FEATURED_PROJECT.desc}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {FEATURED_PROJECT.tags.map(t => (
                <span key={t} className="font-mono text-[11px] px-2.5 py-1 border border-line text-ink-dim">{t}</span>
              ))}
            </div>
            <div className="flex gap-3">
              <a href={FEATURED_PROJECT.github} target="_blank" rel="noopener noreferrer"
                className="text-sm px-5 py-2.5 border border-line text-ink hover:border-ink-dim transition-colors">GitHub</a>
              <a href={FEATURED_PROJECT.demo} target="_blank" rel="noopener noreferrer"
                className="text-sm px-5 py-2.5 bg-accent text-paper font-medium hover:bg-accent-dim transition-colors">Live Demo</a>
            </div>
          </div>

          {/* Rest */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {OTHER_PROJECTS.map(p => (
              <div key={p.title} className="border border-line hover:border-accent/50 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <img src={p.logo} alt="" loading="lazy" className="w-14 h-14 shrink-0 rounded-lg" />
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-1">{p.category}</p>
                      <h3 className="font-display text-base font-semibold text-ink leading-snug">{p.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-ink-dim leading-relaxed mb-4 flex-1">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.map(t => <span key={t} className="font-mono text-[10px] px-2 py-0.5 border border-line text-ink-faint">{t}</span>)}
                  </div>
                  <div className="flex gap-2">
                    {p.github
                      ? <a href={p.github} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-xs py-2 border border-line text-ink-dim hover:border-ink-dim">GitHub</a>
                      : <span className="flex-1 text-center text-xs py-2 border border-line/50 text-ink-faint">Private</span>}
                    {p.demo
                      ? <a href={p.demo} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-xs py-2 bg-accent text-paper font-medium">Live Demo</a>
                      : <span className="flex-1 text-center text-xs py-2 border border-line/50 text-ink-faint">No demo</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div></Fade>
      </section>

      {/* ACADEMIC PROJECTS */}
      <section className="py-20 border-t border-line">
        <Fade><div className="max-w-6xl mx-auto px-4 sm:px-8">
          <Hdr label="Bachelor & Master" title="Academic Projects" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ACADEMIC_PROJECTS.map(p => (
              <div key={p.title} className={`p-5 border ${p.highlight ? 'border-accent/50' : 'border-line'}`}>
                <h3 className="font-display text-sm font-semibold text-ink mb-2 leading-snug">{p.title}</h3>
                <p className="text-sm text-ink-dim leading-relaxed mb-3">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {p.tags.map(t => <span key={t} className="font-mono text-[10px] px-2 py-0.5 border border-line text-ink-faint">{t}</span>)}
                </div>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className={`text-xs flex items-center gap-1.5 ${p.highlight ? 'text-accent' : 'text-ink-faint'}`}>
                    {p.highlight && '★'} {p.result}
                  </div>
                  {p.demo && (
                    <a href={p.demo} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1 bg-accent text-paper font-medium">Live Demo</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div></Fade>
      </section>

      {/* RESEARCH */}
      <section id="research" className="py-20 border-t border-line">
        <Fade><div className="max-w-6xl mx-auto px-4 sm:px-8">
          <Hdr label="Master's Thesis · VU Amsterdam · 2026" title="Thesis Research" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <p className="font-mono text-xs text-good mb-4">✓ Completed &amp; Passed (June 2026)</p>
              <h3 className="font-display text-2xl font-semibold text-ink mb-1">Author Profiling of Hate Speech Spreaders</h3>
              <p className="font-mono text-xs uppercase tracking-wide text-accent mb-6">Zero-shot LLMs vs. Fine-tuned Encoder Models</p>

              <blockquote className="border-l-2 border-accent pl-4 mb-6">
                <p className="font-display italic text-lg text-ink leading-relaxed">
                  "What is the best approach for predicting the age group and gender of authors
                  from hateful comments: zero-shot classification using LLMs, or a pretrained
                  encoder model fine-tuned on datasets annotated for age and gender?"
                </p>
              </blockquote>

              <p className="text-ink-dim leading-relaxed mb-5">
                Evaluated on the English portion of <strong className="text-ink">LiLaH-HAG</strong> (619 Facebook hate speech comments
                annotated for author age &amp; gender): zero-shot inference with <strong className="text-ink">LLaMA-3.1 &amp; Qwen3</strong> versus
                BERT-family encoders (<strong className="text-ink">BERT, HateBERT, RoBERTa</strong>) fine-tuned on the cross-domain <strong className="text-ink">PAN14</strong> corpus.
                A follow-up experiment extends gender identification to Slovene, testing whether an explicit grammatical gender cue narrows the gap.
              </p>
              <p className="text-ink-dim leading-relaxed mb-6">
                Zero-shot LLMs edge out fine-tuned encoders on gender, while encoders do better on age,
                but neither is reliable enough for practical use, and the <strong className="text-ink">66+ age group is almost never identified
                correctly</strong> by any model.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {['NLP', 'Author Profiling', 'Hate Speech Detection', 'LLMs', 'BERT', 'Zero-shot Inference', 'Fine-tuning', 'Cross-dataset Evaluation', 'Error Analysis'].map(t => (
                  <span key={t} className="font-mono text-[11px] px-2.5 py-1 border border-line text-ink-dim">{t}</span>
                ))}
              </div>

              <a href="/Manar-Attar-Thesis.pdf" download
                className="inline-block px-6 py-3 bg-accent text-paper font-medium text-sm hover:bg-accent-dim transition-colors">
                Download Thesis
              </a>
            </div>

            <div className="border border-line bg-paper-raised p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint mb-5">Macro F1 by model type</p>
              <div className="flex items-center gap-5 mb-7 font-mono text-[11px] uppercase tracking-wide">
                <span className="flex items-center gap-2 text-accent"><span className="w-2 h-2 bg-accent inline-block" />Zero-shot LLM</span>
                <span className="flex items-center gap-2 text-ink-dim"><span className="w-2 h-2 bg-ink-dim inline-block" />Fine-tuned BERT</span>
              </div>
              <div className="space-y-6">
                {THESIS_SCORES.map(s => (
                  <div key={s.metric}>
                    <p className="font-mono text-xs text-ink-faint uppercase mb-2.5">{s.metric}</p>
                    <ScoreBar value={s.llm} color="bg-accent" />
                    <ScoreBar value={s.bert} color="bg-ink-dim" />
                  </div>
                ))}
              </div>
              <p className="font-mono text-[11px] text-ink-faint mt-7">
                Dataset: LiLaH-HAG (EN, n=619) + PAN14 · Models: LLaMA-3.1-8B, Qwen3-32B, BERT, HateBERT, RoBERTa
              </p>
            </div>
          </div>
        </div></Fade>
      </section>

      {/* EXPERIENCE + EDUCATION */}
      <section id="experience" className="py-20 border-t border-line">
        <Fade><div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Hdr label="Career" title="Work Experience" left />
              <div className="flex flex-col gap-6">
                {EXPERIENCE.map(e => (
                  <div key={e.company} className="border-l-2 border-line pl-5 hover:border-accent transition-colors">
                    <div className="flex justify-between flex-wrap gap-1 mb-2">
                      <div>
                        <span className="font-display font-semibold text-ink">{e.role}</span>
                        <span className="font-mono text-xs text-accent ml-2">@ {e.company}</span>
                      </div>
                      <span className="font-mono text-xs text-ink-faint">{e.period}</span>
                    </div>
                    <ul className="space-y-1">
                      {e.points.map(pt => <li key={pt} className="text-sm text-ink-dim leading-relaxed list-disc ml-4">{pt}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Hdr label="Academic" title="Education" left />
              <div className="flex flex-col gap-6">
                {EDUCATION.map(e => (
                  <div key={e.degree} className="border-l-2 border-line pl-5 hover:border-accent transition-colors">
                    <div className="flex justify-between flex-wrap gap-1 mb-1">
                      <span className="font-display font-semibold text-ink">{e.degree}</span>
                      <span className="font-mono text-xs text-ink-faint">{e.period}</span>
                    </div>
                    <span className="font-mono text-xs text-accent">{e.school}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div></Fade>
      </section>

      {/* SKILLS */}
      <section id="skills" className="py-20 border-t border-line">
        <Fade><div className="max-w-6xl mx-auto px-4 sm:px-8">
          <Hdr label="Technical" title="Skills & Tools" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
            {SKILLS.map(s => (
              <div key={s.group} className="border border-line p-5">
                <div className="font-mono text-[11px] uppercase tracking-widest text-accent mb-3">{s.group}</div>
                <div className="flex flex-wrap gap-1.5">
                  {s.items.map(i => <span key={i} className="font-mono text-[11px] px-2 py-0.5 border border-line text-ink-dim">{i}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div className="border border-line p-5">
            <div className="font-mono text-[11px] uppercase tracking-widest text-accent mb-3">Languages</div>
            <div className="flex flex-wrap gap-2">
              {[['English', 'Fluent'], ['Arabic', 'Native'], ['Dutch', 'Advanced · B2']].map(([l, lvl]) => (
                <div key={l} className="text-sm px-3 py-1.5 border border-line text-ink-dim">
                  {l} <span className="text-ink-faint font-mono text-xs">· {lvl}</span>
                </div>
              ))}
            </div>
          </div>
        </div></Fade>
      </section>

      {/* PUBLICATIONS */}
      <section className="py-20 border-t border-line">
        <Fade><div className="max-w-6xl mx-auto px-4 sm:px-8">
          <Hdr label="Research Output" title="Publications" />
          <div className="flex flex-col gap-4">
            {PUBLICATIONS.map(p => (
              <div key={p.title} className="border-l-2 border-accent pl-5 py-1">
                <p className="font-medium text-ink mb-1 leading-relaxed">{p.title}</p>
                <p className="text-sm text-ink-dim mb-1">{p.authors}</p>
                <p className="font-mono text-xs text-accent">{p.venue}</p>
              </div>
            ))}
          </div>
        </div></Fade>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 border-t border-line">
        <Fade><div className="max-w-6xl mx-auto px-4 sm:px-8">
          <Hdr label="Get In Touch" title="Contact" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-ink-dim leading-relaxed mb-7">
                Open to AI/ML roles. Reach out for collaborations, opportunities, or just to talk AI.
              </p>
              <div className="flex flex-col mb-6">
                {[
                  { href: 'mailto:manarattar77@gmail.com', label: 'manarattar77@gmail.com', icon: 'mail' },
                  { href: 'https://linkedin.com/in/manar-attar', label: 'linkedin.com/in/manar-attar', icon: 'briefcase', blank: true },
                  { href: 'https://github.com/manarattar', label: 'github.com/manarattar', icon: 'github', blank: true },
                ].map(({ href, label, icon, blank }) => (
                  <a key={label} href={href} {...(blank ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="flex items-center gap-3 py-3 border-b border-line text-ink-dim hover:text-accent transition-colors text-sm">
                    <Icon name={icon} size={15} />{label}
                  </a>
                ))}
              </div>
              <a href="/Manar-Attar-CV.pdf" download
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-paper font-medium text-sm hover:bg-accent-dim transition-colors">
                Download CV
              </a>
            </div>
            <ContactForm />
          </div>
        </div></Fade>
      </section>

      <footer className="border-t border-line py-6 text-center font-mono text-xs text-ink-faint">
        © 2026 Manar Attar
      </footer>

      <AssistantWidget />
    </div>
  )
}

function ScoreBar({ value, color }) {
  const max = 0.6
  return (
    <div className="flex items-center gap-3 mb-1.5">
      <div className="flex-1 h-1.5 bg-line/70">
        <div className={`h-full ${color}`} style={{ width: `${(value / max) * 100}%` }} />
      </div>
      <span className="font-mono text-xs text-ink-dim w-10 text-right">{value.toFixed(3)}</span>
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

  const inputClass = "w-full py-2.5 bg-transparent border-b border-line text-ink text-sm outline-none focus:border-accent transition-colors placeholder:text-ink-faint"

  if (status === 'success') return (
    <div className="border border-line p-10 text-center">
      <div className="flex justify-center mb-4 text-good"><Icon name="checkCircle" size={36} /></div>
      <p className="font-display text-lg font-semibold text-ink mb-2">Message sent!</p>
      <p className="text-sm text-ink-dim mb-6">I'll get back to you soon.</p>
      <button onClick={() => { setForm({ name: '', email: '', message: '' }); setStatus('idle') }}
        className="px-5 py-2 border border-accent/50 text-accent text-sm hover:bg-accent/10 transition-colors">
        Send another
      </button>
    </div>
  )

  return (
    <form onSubmit={submit} className="border border-line p-6 sm:p-8 flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-[11px] text-ink-faint uppercase tracking-wide mb-2">Name</label>
          <input required value={form.name} onChange={set('name')} placeholder="Jane Smith" className={inputClass} />
        </div>
        <div>
          <label className="block font-mono text-[11px] text-ink-faint uppercase tracking-wide mb-2">Email</label>
          <input required type="email" value={form.email} onChange={set('email')} placeholder="jane@company.com" className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block font-mono text-[11px] text-ink-faint uppercase tracking-wide mb-2">Message</label>
        <textarea required value={form.message} onChange={set('message')} placeholder="Hi Manar, I'd love to discuss..." rows={5}
          className={`${inputClass} resize-vertical font-sans`} />
      </div>
      {status === 'error' && <p className="text-sm text-accent">Something went wrong. Try emailing directly.</p>}
      <button type="submit" disabled={status === 'sending'}
        className="py-3 bg-accent text-paper font-medium text-sm hover:bg-accent-dim disabled:opacity-60 transition-colors">
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
    <div className={`${left ? 'text-left' : 'text-center'} mb-10`}>
      <p className="font-mono text-[11px] uppercase tracking-widest text-accent mb-2">{label}</p>
      <h2 className="font-display text-3xl font-semibold text-ink">{title}</h2>
    </div>
  )
}
