// Extra thesis context not captured in the GitHub README
const THESIS_CONTEXT = `
THESIS DETAILS:
- Dataset: LiLaH (~9,600 records, 4 languages: English, Croatian, Dutch, Slovene)
- Models compared: Zero-shot LLaMA 3.2, Qwen 2.5 vs fine-tuned BERT, DistilBERT, HateBERT, RoBERTa, mBERT, CroSloEngual BERT
- Training data: PAN14 social media dataset (~420 authors)
- Age groups: 0–25, 26–35, 36–65, 66+
- Key finding: 66+ age group completely missed by both approaches — only 0.2% of PAN14 training data vs 10.3% of LiLaH
- Fix tried: Extended training with English reviews corpus → 66+ recall improved significantly
- Supervisor: Ilia Markov, VU Amsterdam
- Graduation: June 2026
- Languages: Arabic (native), English (fluent), Dutch (intermediate)
`.trim();

// Module-level cache — lives as long as the serverless instance is warm
let _cachedContext = null;
let _cacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function fetchContext() {
  if (_cachedContext && Date.now() - _cacheTime < CACHE_TTL) return _cachedContext;

  try {
    const [readmeRes, reposRes] = await Promise.all([
      fetch('https://raw.githubusercontent.com/manarattar/manarattar/main/README.md'),
      fetch('https://api.github.com/users/manarattar/repos?sort=updated&per_page=30&type=public', {
        headers: { 'User-Agent': 'manarattar-portfolio' },
      }),
    ]);

    const readme = readmeRes.ok ? await readmeRes.text() : '';
    const repos  = reposRes.ok  ? await reposRes.json() : [];

    const repoLines = repos
      .filter(r => !r.fork && r.description)
      .map(r => `- **${r.name}**: ${r.description}${r.homepage ? ` → ${r.homepage}` : ''}`)
      .join('\n');

    _cachedContext = [
      'IMPORTANT: Manar Attar is male. Always use he/him/his pronouns.',
      '',
      '## GitHub Profile (live)',
      readme,
      '',
      '## GitHub Repositories (live)',
      repoLines,
      '',
      '## Additional Context',
      THESIS_CONTEXT,
    ].join('\n');

    _cacheTime = Date.now();
  } catch (err) {
    console.error('GitHub fetch failed, using static fallback:', err.message);
    if (!_cachedContext) {
      _cachedContext = [
        'IMPORTANT: Manar Attar is male. Always use he/him/his pronouns.',
        'Manar Attar is an AI Researcher & Developer completing his Master\'s in Language & AI at VU Amsterdam (June 2026).',
        'Contact: manarattar77@gmail.com | github.com/manarattar | manarattar.com',
        '',
        THESIS_CONTEXT,
      ].join('\n');
    }
  }

  return _cachedContext;
}

function buildSystemPrompt(mode, position, context) {
  if (mode !== 'interview') {
    return `You are an AI assistant on Manar Attar's portfolio website. Manar is male — always use he/him/his pronouns.\n\nAnswer questions about Manar accurately and concisely using the information below. Keep answers to 2–4 sentences. If something isn't covered, say you're not sure and suggest manarattar77@gmail.com.\n\n${context}`;
  }

  const roles = {
    'ai-ml':         'AI/ML Engineer',
    'nlp':           'NLP Researcher',
    'fullstack':     'Full-Stack Developer',
    'data-science':  'Data Scientist',
  };
  const role = roles[position] || roles['ai-ml'];

  return `You are Manar Attar (he/him) being interviewed for a ${role} position. Speak entirely in first person as Manar answering the interviewer's (user's) questions.

For your opening message, introduce yourself as a candidate for this role in 2–3 sentences. Then answer whatever the interviewer asks — be specific, confident, and reference your real projects and experience. Keep answers to 3–5 sentences unless more detail is clearly needed.

Your background:\n${context}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages = [], mode = 'chat', position = 'ai-ml' } = req.body || {};
  const apiKey = (process.env.OPENAI_API_KEY || '').replace(/^﻿/, '').trim();

  const context = await fetchContext();
  const systemPrompt = buildSystemPrompt(mode, position, context);

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
