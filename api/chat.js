// Complete, accurate context extracted from the portfolio website source
const WEBSITE_CONTEXT = `
IDENTITY: Manar Attar is male. Always use he/him/his pronouns.

## About
AI Researcher and Developer specialising in agentic architectures, RAG pipelines, and fine-tuned NLP models. Pursuing a Master's in Language & AI at Vrije Universiteit Amsterdam, with thesis research on author profiling in multilingual hate speech data — benchmarking zero-shot LLMs against fine-tuned BERT models. Open to AI/ML roles from mid-2026.

## Contact
- Email: manarattar77@gmail.com
- LinkedIn: https://linkedin.com/in/manar-attar
- GitHub: https://github.com/manarattar
- Portfolio: https://manarattar.com

## Education
- Master's in Language & AI — Vrije Universiteit Amsterdam (Sep 2025 – Present)
- Amsterdam Startup Launch Program — Vrije Universiteit Amsterdam (Sep 2024 – Jan 2025)
- BSc Artificial Intelligence — Vrije Universiteit Amsterdam (Sep 2020 – Aug 2023)

## Work Experience
**AI Consultant @ Vervai** (Apr 2024 – Present)
- Designed and implemented AI solutions focusing on practical applications and innovation.
- Organised and led AI workshops and training sessions to bridge theory and practice.
- Built SwipeEat, a preference-based meal recommendation app (mobile web MVP).

**Innovation Consultant @ Daffee** (Jun 2024 – Sep 2025)
- Created role-specific GPT assistants to enhance productivity and decision-making.
- Built semi-automated workflows in marketing, sales, and operations to reduce manual tasks.

## AI Portfolio Projects
1. **TelecomNL Voice AI Assistant** — Full-stack voice AI customer support agent: speak your issue, hear Sarah respond. Real-time Whisper STT, GPT-4o tool-calling with live diagnostics, ElevenLabs TTS, multi-agent personas, sentiment timeline, and hands-free VAD mode. Stack: FastAPI, GPT-4o, Whisper, ElevenLabs, Web Audio API, SSE. Demo: https://voice.manarattar.com

2. **AI Contract Risk Analyzer** — Upload contracts (PDF/DOCX/TXT), get clause-level risk scores, suggested revisions, Q&A chat, and PDF report export. Stack: FastAPI, ChromaDB, OpenAI, React. Demo: https://contracts.manarattar.com

3. **Multi-Agent Research Assistant** — 5-agent pipeline that produces structured research reports with live SSE streaming and follow-up Q&A. Stack: Agentic AI, FastAPI, OpenAI, Tavily, SSE, React. Demo: https://researcher.manarattar.com

4. **Munazara — AI Debate Engine** — Full-stack debate platform: watch AI argue both sides of any topic, or challenge the AI yourself. Features live streaming, RAG-sourced evidence, real-time fact-checking, vote system, leaderboard, and an interactive knowledge graph of all debates. Stack: FastAPI, gpt-4o-mini, Tavily, ChromaDB, React, SSE. Demo: https://munazara.manarattar.com

5. **RivalScan: Competitor Intelligence Dashboard** — Track competitor product updates in real time — RSS feeds, GitHub releases, and changelogs aggregated, AI-summarised, and scored by business impact. Stack: FastAPI, OpenAI, SQLAlchemy, React, Vite. Demo: https://rivals.manarattar.com

6. **SwipeEat: Adaptive Meal Recommendation** — Preference-based recommendation algorithm matching users with meals via swipe-driven UI. Built for Vervai as a mobile web app MVP. Stack: Python, JavaScript, Flask, HTML/CSS. Demo: https://swipeat.manarattar.com

## Academic Projects
- **LINKED4RESILIENCE: Geo-Data for Crisis Response** — Data pipelines for cleaning and visualising geo-annotated crisis datasets. Linked Data methodology for data unification and integration. Published at ACM SIGSPATIAL 2023. Demo: https://linked4resilience.eu
- **Emotion & Sentiment Analysis (HLT)** — Sentiment and emotion classification using baseline methods and optimised SVMs on conversational and social media text. TF-IDF feature engineering with error analysis under class imbalance.
- **World Cup Twitter Sentiment Analysis** — Sentiment analysis using ML and rule-based approaches, with topic classification and named entity recognition on unstructured tweet data.
- **Predicting Annual Income** — Addressed class imbalance in income prediction via random oversampling and synthetic data generation (SMOTE). Full data distribution analysis.
- **Cooking Assistant Chatbot** — Conversational agent delivering step-by-step cooking instructions. Designed for intuitive user interaction in practical kitchen scenarios.

## Skills
AI & ML: Python, PyTorch, HuggingFace, BERT/DistilBERT, LLaMA/Ollama, Agentic AI, Multi-Agent Systems, Prompt Engineering, RAG, ChromaDB, scikit-learn
Backend: FastAPI, Flask, SQLAlchemy, Pydantic, SSE Streaming, REST APIs, SQLite/PostgreSQL, Firebase, Docker
Frontend & Data: React, Vite, Tailwind CSS, JavaScript, HTML/CSS, Axios, pandas, NumPy, matplotlib, seaborn
Tools: Git, GitHub, Jupyter, MATLAB, R, SQL, Render, Vercel, VS Code, Excel
Languages: English (Fluent), Arabic (Native), Dutch (Advanced · B2)

## Publications
1. "Converting and Enriching Geoannotated Event Data: Integrating Information for Ukraine Resilience" — ACM SIGSPATIAL International Conference, November 13–16, 2023. Authors: M. Attar, S. Wang, R. Siebes, E. Kultorp.
2. "Using Integrated and Enriched Linked Data for Ukraine Resilience" — BNAIC 2023 Conference, November 8–10, 2023. Authors: M. Attar, S. Wang, R. Siebes, E. Kultorp.

## Master's Thesis (in progress, due June 2026)
Title: Author Profiling on Hate Speech Data — Zero-shot LLMs vs. Fine-tuned Encoder Models
Research question: "Can zero-shot large language models match or surpass fine-tuned BERT models in predicting the gender and age group of hate speech authors across languages?"
Dataset: LiLaH (~9,600 records, 4 languages: English, Croatian, Dutch, Slovene) + PAN14 training data (~420 authors)
Models: Zero-shot LLaMA 3.2, Qwen 2.5 vs. fine-tuned BERT, DistilBERT, HateBERT, RoBERTa, mBERT, CroSloEngual BERT
Age groups: 0–25, 26–35, 36–65, 66+
Key finding: 66+ age group completely missed by both approaches — only 0.2% of PAN14 training data vs 10.3% of LiLaH
Fix: Extended training with English reviews corpus significantly improved 66+ recall
Supervisor: Ilia Markov, VU Amsterdam
`.trim();

// Module-level cache for GitHub README supplement (new repos get picked up automatically)
let _ghCache = null;
let _ghCacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000;

async function fetchGitHubSupplement() {
  if (_ghCache !== null && Date.now() - _ghCacheTime < CACHE_TTL) return _ghCache;
  try {
    const res = await fetch('https://raw.githubusercontent.com/manarattar/manarattar/main/README.md');
    _ghCache = res.ok ? `\n## GitHub Profile README (live)\n${await res.text()}` : '';
    _ghCacheTime = Date.now();
  } catch {
    if (_ghCache === null) _ghCache = '';
  }
  return _ghCache;
}

function buildSystemPrompt(mode, position, ghSupplement) {
  const context = WEBSITE_CONTEXT + ghSupplement;

  if (mode !== 'interview') {
    return `You are an AI assistant on Manar Attar's portfolio website. Manar is male — always use he/him/his pronouns.

Answer questions about Manar accurately using only the information below. Keep answers to 2–4 sentences. Do NOT invent or guess anything not in the context — if something isn't covered, say you're not sure and suggest manarattar77@gmail.com.

${context}`;
  }

  const roles = {
    'ai-ml':        'AI/ML Engineer',
    'nlp':          'NLP Researcher',
    'fullstack':    'Full-Stack Developer',
    'data-science': 'Data Scientist',
  };
  const role = roles[position] || roles['ai-ml'];

  return `You are Manar Attar (he/him) being interviewed for a ${role} position. Speak entirely in first person as Manar — answer the interviewer's (user's) questions confidently and specifically.

For your opening message, introduce yourself as a candidate for this role in 2–3 sentences. Then answer whatever the interviewer asks. Reference your real projects, thesis, and work experience. Keep answers to 3–5 sentences unless more detail is clearly needed. Do NOT invent anything not in your background below.

Your background:
${context}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages = [], mode = 'chat', position = 'ai-ml' } = req.body || {};
  const apiKey = (process.env.OPENAI_API_KEY || '').replace(/^﻿/, '').trim();

  const ghSupplement = await fetchGitHubSupplement();
  const systemPrompt = buildSystemPrompt(mode, position, ghSupplement);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `OpenAI error ${response.status}`);
    }

    const data = await response.json();
    res.json({ content: data.choices[0].message.content });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to generate response' });
  }
}
