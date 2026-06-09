export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { audio, mimeType = 'audio/webm' } = req.body || {};
  if (!audio) return res.status(400).json({ error: 'No audio provided' });

  try {
    const buffer = Buffer.from(audio, 'base64');
    const formData = new FormData();
    formData.append('file', new Blob([buffer], { type: mimeType }), 'recording.webm');
    formData.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `OpenAI error ${response.status}`);
    }

    const data = await response.json();
    res.json({ text: data.text });
  } catch (err) {
    console.error('Transcription error:', err.message);
    res.status(500).json({ error: err.message || 'Transcription failed' });
  }
}
