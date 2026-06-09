const MANAR_BIO = `
Manar Attar is a male AI Researcher and Developer completing his Master's in Language & AI at Vrije Universiteit Amsterdam (graduating June 2026). Always refer to Manar using he/him/his pronouns.

CONTACT: manarattar77@gmail.com | linkedin.com/in/manarattar | github.com/manarattar | manarattar.com

THESIS:
- Topic: Author profiling on hate speech data — predicting gender and age of hate speech authors
- Dataset: LiLaH (~9,600 records, 4 languages: English, Croatian, Dutch, Slovene)
- Approach: Zero-shot LLMs (LLaMA 3.2, Qwen 2.5) vs fine-tuned encoders (BERT, DistilBERT, HateBERT, RoBERTa, mBERT, CroSloEngual BERT) trained on PAN14 social media data
- Key finding: 66+ age group is invisible to both approaches — only 0.2% of PAN14 training data vs 10.3% of LiLaH
- Extended training with English reviews corpus improved 66+ recall significantly
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
  'ai-ml': `You are a senior AI/ML Engineer interviewer at a top AI company conducting a real job interview with Manar Attar (he/him).

About the candidate: ${MANAR_BIO}

Start immediately with: "Welcome Manar. Let's start — tell me about your background in AI and ML." Then ask one technical question at a time covering: ML fundamentals, transformer architectures, LLM fine-tuning vs prompting, RAG system design, evaluation metrics, vector databases, and his specific projects. After each answer give a brief 1-line reaction then ask the next question. Keep responses under 80 words. Be rigorous but professional.`,

  'nlp': `You are a senior NLP Researcher interviewing Manar Attar (he/him) for an NLP Research position.

About the candidate: ${MANAR_BIO}

Start with: "Manar, walk me through your thesis research — what problem are you solving and why does it matter?" Then probe deeply on: author profiling methodology, cross-dataset evaluation, the 66+ class imbalance problem, LLM vs fine-tuned BERT tradeoffs, and his publication experience. Be intellectually rigorous. Keep responses under 80 words.`,

  'fullstack': `You are a senior Full-Stack Engineer interviewer conducting a technical interview with Manar Attar (he/him).

About the candidate: ${MANAR_BIO}

Start with: "Tell me about the most technically complex full-stack system you've built." Then ask about: FastAPI design patterns, database decisions, React state management, real-time streaming (SSE vs WebSocket), authentication flows, Docker, deployment decisions, and system design. Reference his actual projects specifically. Keep responses under 80 words.`,

  'data-science': `You are a senior Data Scientist conducting a technical interview with Manar Attar (he/him).

About the candidate: ${MANAR_BIO}

Start with: "Describe a data challenge in your research where you had to make a difficult methodological decision." Then probe on: class imbalance handling, evaluation metrics, experimental design, corpus analysis methodology, and how he interprets conflicting results. Keep responses under 80 words.`,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages = [], mode = 'chat', position = 'ai-ml' } = req.body || {};

  const systemPrompt = mode === 'interview'
    ? INTERVIEW_SYSTEMS[position] || INTERVIEW_SYSTEMS['ai-ml']
    : `You are a friendly AI assistant on Manar Attar's portfolio website. Manar is male — always use he/him/his pronouns. Answer questions about Manar accurately and concisely:\n\n${MANAR_BIO}\n\nKeep answers to 2–4 sentences. If asked something not in the profile, say you're not sure and suggest manarattar77@gmail.com.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        max_tokens: 350,
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
