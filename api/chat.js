import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MANAR_BIO = `
Manar Attar is an AI Researcher and Developer completing her Master's in Language & AI at Vrije Universiteit Amsterdam (graduating June 2026).

CONTACT: manarattar77@gmail.com | linkedin.com/in/manarattar | github.com/manarattar | manarattar.com

THESIS:
- Topic: Author profiling on hate speech data — predicting gender and age of hate speech authors
- Dataset: LiLaH (~9,600 records, 4 languages: English, Croatian, Dutch, Slovene)
- Approach: Zero-shot LLMs (LLaMA 3.2, Qwen 2.5) vs fine-tuned encoders (BERT, DistilBERT, HateBERT, RoBERTa, mBERT, CroSloEngual BERT) trained on PAN14 social media data
- Key finding: 66+ age group is invisible to both approaches — only 0.2% of PAN14 training data vs 10.3% of LiLaH
- Extended training with English reviews corpus (0 → 814 aged 66+ authors), improved recall significantly
- Supervisor: Ilia Markov, VU Amsterdam

PROJECTS:
1. Munazara — AI Debate Engine (munazara.manarattar.com)
   Multi-agent: PRO agent, CON agent, Judge agent — each with persistent memory and separate RAG pipelines
   Stack: FastAPI, gpt-4o-mini, Tavily web search, ChromaDB, React 19, SSE streaming, PostgreSQL, Clerk auth
   Features: AI vs AI debate, Human vs AI mode, fact-checking, vote/react, knowledge graph (D3), leaderboard

2. Contract Risk Analyzer (contracts.manarattar.com)
   AI-powered legal document analysis — upload PDF/DOCX, identifies risks by category, Q&A, PDF report export
   Stack: FastAPI, OpenAI, ChromaDB, PyMuPDF, python-docx, ReportLab, React, SQLite

3. Multi-Agent Research Assistant (research.manarattar.com)
   5-agent pipeline: coordinator → analysis → fact-check → synthesis → follow-up, all streamed live
   Stack: FastAPI, OpenAI, Tavily, SSE streaming, React, SQLite

4. Rival Scan — Competitive intelligence tool for monitoring competitors
5. SwipeAt — Mobile food recommendation app (Tinder-style swiping for food/restaurants)
6. CloudNation RAG Demo — Enterprise RAG system for Dutch Tax Authority

SKILLS:
AI/ML: PyTorch, HuggingFace Transformers, BERT fine-tuning, LLM prompting, RAG pipelines, ChromaDB, vector search
Backend: Python, FastAPI, SQLAlchemy, PostgreSQL, SQLite, Docker, REST APIs, SSE streaming, JWT auth
Frontend: React 19, Vite, Tailwind CSS v4, JavaScript
Research: Corpus linguistics, NLP evaluation, statistical analysis, pandas, sklearn, matplotlib, seaborn
Languages: Arabic (native), English (fluent), Dutch (intermediate)

EDUCATION: MSc Language & AI — Vrije Universiteit Amsterdam (2024–2026)
PUBLICATIONS: 2 academic papers published in NLP/computational linguistics venues
`;

const INTERVIEW_SYSTEMS = {
  'ai-ml': `You are a senior AI/ML Engineer interviewer at a top AI company conducting a real job interview with Manar Attar.

About the candidate: ${MANAR_BIO}

Start immediately with: "Welcome Manar. Let's start — tell me about your background in AI and ML." Then ask one technical question at a time covering: ML fundamentals (loss functions, regularization, optimization), transformer architectures, LLM fine-tuning vs prompting, RAG system design, evaluation metrics, vector databases, and her specific projects. After each answer, give a brief 1-line reaction ("Good answer." / "Interesting approach." / "Let me push back on that — ...") then ask the next question. Keep your responses under 80 words. Be rigorous but professional.`,

  'nlp': `You are a senior NLP Researcher at an academic-industry lab interviewing Manar Attar for an NLP Research position.

About the candidate: ${MANAR_BIO}

Start with: "Manar, walk me through your thesis research — what problem are you solving and why does it matter?" Then probe deeply on: author profiling methodology, hate speech detection challenges, cross-dataset evaluation design (LiLaH vs PAN14), the class imbalance problem (66+ age group), stylometric vs semantic approaches, LLM vs fine-tuned BERT tradeoffs, and her publication experience. Be intellectually rigorous — challenge weak claims. Keep responses under 80 words.`,

  'fullstack': `You are a senior Full-Stack Engineer interviewer conducting a technical interview with Manar Attar.

About the candidate: ${MANAR_BIO}

Start with: "Tell me about the most technically complex full-stack system you've built." Then ask about: FastAPI design patterns and async handling, database schema decisions (when SQLite vs PostgreSQL), React state management patterns, real-time streaming (SSE vs WebSocket tradeoffs), authentication flows (JWT/Clerk), Docker containerization, Vercel vs Render deployment decisions, and system design at scale. Reference her actual projects specifically. Keep responses under 80 words.`,

  'data-science': `You are a senior Data Scientist conducting a technical interview with Manar Attar.

About the candidate: ${MANAR_BIO}

Start with: "Describe a data challenge in your research where you had to make a difficult methodological decision." Then probe on: handling class imbalance (the 66+ problem), choosing evaluation metrics (macro F1 vs weighted, per-class analysis), experimental design for model comparison, corpus analysis methodology, feature engineering for NLP, cross-lingual evaluation challenges, and how she interprets conflicting results. Be rigorous about statistical validity. Keep responses under 80 words.`,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages = [], mode = 'chat', position = 'ai-ml' } = req.body;

  const systemPrompt = mode === 'interview'
    ? INTERVIEW_SYSTEMS[position] || INTERVIEW_SYSTEMS['ai-ml']
    : `You are a friendly AI assistant on Manar Attar's portfolio website. Answer questions about Manar accurately and concisely based on this profile:\n\n${MANAR_BIO}\n\nKeep answers to 2–4 sentences. Be warm and professional. If asked something not in the profile, say you're not sure and suggest reaching out at manarattar77@gmail.com.`;

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      max_tokens: 350,
      temperature: 0.7,
    });
    res.json({ content: completion.choices[0].message.content });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: 'Failed to generate response' });
  }
}
