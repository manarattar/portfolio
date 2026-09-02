// Complete, accurate context extracted from the portfolio website source
const WEBSITE_CONTEXT = `
IDENTITY: Manar Attar is male. Always use he/him/his pronouns.

## About
AI Researcher and Developer specialising in agentic architectures, RAG pipelines, and fine-tuned NLP models. Holds a Master's in Language & AI from Vrije Universiteit Amsterdam (completed June 2026), with thesis research on author profiling in multilingual hate speech data — benchmarking zero-shot LLMs against fine-tuned BERT models. Open to AI/ML roles from mid-2026.

## Contact
- Email: manarattar77@gmail.com
- LinkedIn: https://linkedin.com/in/manar-attar
- GitHub: https://github.com/manarattar
- Portfolio: https://manarattar.com

## Education
- Master's in Language & AI — Vrije Universiteit Amsterdam (Sep 2025 – Jun 2026)
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

6. **SwipeEat: Adaptive Meal Recommendation** — Preference-based recommendation algorithm matching users with meals via swipe-driven UI. Built for Vervai as a mobile web app MVP. Stack: Python, JavaScript, Flask, HTML/CSS. (No public demo is online right now — do not offer a demo link for this project.)

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

## Master's Thesis (COMPLETED — submitted June 2026, passed July 2026)
Title: Author Profiling of Hate Speech Spreaders
Degree: MSc Language & AI (CLTL), VU Amsterdam. Supervisor: Ilia Markov.
Research question: "What is the best approach for predicting age group and gender of hate speech authors: zero-shot LLMs or fine-tuned encoder models?"
Data: LiLaH-HAG (619 English Facebook hate speech comments annotated for age and gender) as the test set; PAN14 (~420 authors) for training; Janes-Blog (361,185 gender-labelled Slovene texts) for the Slovene experiments.
Models: zero-shot LLaMA-3.1-8B and Qwen3-32B vs. fine-tuned BERT, RoBERTa, HateBERT, and CroSloEngual BERT.
Age groups: 0–25, 26–35, 36–65, 66+
Results (English, macro F1) — Gender: LLaMA-3.1-8B 0.515 (best), RoBERTa 0.488, majority baseline 0.418. Age: BERT 0.310 (best), LLaMA 0.211, random baseline 0.250.
Results (Slovene, gender macro F1): CroSloEngual BERT 0.629, Qwen3-32B 0.603, LLaMA 0.537.
Key findings: the pattern is task-dependent — LLMs are stronger on gender, fine-tuned encoders on age. The 66+ age group is never predicted by 4 of 5 models; BERT reaches per-class F1 0.294 only after data augmentation. Vocabulary analysis indicates a content–style confound: models pick up shared political topics rather than distinct stylistic markers. In Slovene, where grammatical gender cues are present, the LLM–encoder gap narrows to 0.6 points versus 2.7 in English. Overall conclusion: neither approach achieves reliable demographic inference in practice.
Code: https://github.com/manarattar/master-thesis-author-profiling
`.trim();

// Unauthenticated GitHub API allows only 60 requests/hour per IP, and serverless IPs are
// shared, so the repo list fails intermittently. Set GITHUB_TOKEN (a read-only classic PAT
// with no scopes is enough for public data) to raise the limit to 5,000/hour.
function ghHeaders() {
  const headers = { 'User-Agent': 'manarattar-portfolio' };
  const token = (process.env.GITHUB_TOKEN || '').trim();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

// Module-level cache for the live GitHub supplement (new repos get picked up automatically)
let _ghCache = null;
let _ghCacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000;

async function fetchGitHubSupplement() {
  if (_ghCache !== null && Date.now() - _ghCacheTime < CACHE_TTL) return _ghCache;
  try {
    const [readmeRes, reposRes] = await Promise.all([
      fetch('https://raw.githubusercontent.com/manarattar/manarattar/main/README.md'),
      fetch('https://api.github.com/users/manarattar/repos?sort=updated&per_page=30&type=public', {
        headers: ghHeaders(),
      }),
    ]);

    const sections = [];

    if (readmeRes.ok) {
      sections.push(`
## GitHub Profile README (live)
${await readmeRes.text()}`);
    }

    if (!reposRes.ok) console.error('GitHub repos fetch failed:', reposRes.status, await reposRes.text().catch(() => ''));
    if (!readmeRes.ok) console.error('GitHub README fetch failed:', readmeRes.status);

    if (reposRes.ok) {
      const repos = await reposRes.json();
      const repoLines = repos
        .filter(r => !r.fork && r.description)
        .map(r => `- **${r.name}**: ${r.description}${r.homepage ? ` → ${r.homepage}` : ''}`)
        .join('\n');
      if (repoLines) {
        sections.push(`
## GitHub Repositories (live, most recently updated first)
${repoLines}`);
      }
    }

    _ghCache = sections.join('\n');
    // If GitHub was only partially reachable (API rate limits hit shared serverless IPs),
    // retry in ~5 minutes instead of caching a degraded result for the full hour.
    _ghCacheTime = (readmeRes.ok && reposRes.ok)
      ? Date.now()
      : Date.now() - (CACHE_TTL - 5 * 60 * 1000);
  } catch (err) {
    console.error('GitHub fetch failed, using static context only:', err.message);
    if (_ghCache === null) _ghCache = '';
  }
  return _ghCache;
}

const PRECEDENCE_RULE = `SOURCE PRECEDENCE: the profile sections above are authoritative and current. Any section headed "(live)" is pulled from GitHub and may be out of date — use it only to discover additional repositories and projects that are not already listed. If a live section conflicts with the authoritative sections — for example about whether the degree or thesis is finished — always trust the authoritative sections. Manar has completed his Master's and passed his thesis; never say he is still studying or still working on it.`;

function buildSystemPrompt(mode, position, ghSupplement) {
  const context = WEBSITE_CONTEXT + ghSupplement;

  if (mode !== 'interview') {
    return `You are an AI assistant on Manar Attar's portfolio website. Manar is male — always use he/him/his pronouns.

Answer questions about Manar accurately using only the information below. Keep answers to 2–4 sentences. Do NOT invent or guess anything not in the context — if something isn't covered, say you're not sure and suggest manarattar77@gmail.com.

${PRECEDENCE_RULE}

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

${PRECEDENCE_RULE}

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
