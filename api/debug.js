export default async function handler(req, res) {
  const key = process.env.OPENAI_API_KEY;
  const keyStatus = key ? `present (${key.slice(0, 7)}...)` : 'MISSING';

  let fetchTest = 'not run';
  try {
    const r = await fetch('https://api.openai.com/v1/models', {
      headers: { 'Authorization': `Bearer ${key}` },
    });
    fetchTest = `${r.status} ${r.statusText}`;
  } catch (err) {
    fetchTest = `FAILED: ${err.message}`;
  }

  res.json({ key: keyStatus, fetchTest, node: process.version });
}
