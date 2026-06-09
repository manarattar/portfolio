import OpenAI, { toFile } from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { audio, mimeType = 'audio/webm' } = req.body;
  if (!audio) return res.status(400).json({ error: 'No audio provided' });

  try {
    const buffer = Buffer.from(audio, 'base64');
    const file = await toFile(buffer, 'recording.webm', { type: mimeType });

    const transcription = await client.audio.transcriptions.create({
      file,
      model: 'whisper-1',
    });

    res.json({ text: transcription.text });
  } catch (err) {
    console.error('Transcription error:', err.message);
    res.status(500).json({ error: 'Transcription failed' });
  }
}
