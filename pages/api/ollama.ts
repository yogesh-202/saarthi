import { NextApiRequest, NextApiResponse } from 'next';
import { queryOllama } from '@/lib/ollamaClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const result = await queryOllama(prompt);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to query Ollama' });
  }
}
