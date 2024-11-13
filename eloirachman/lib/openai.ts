import OpenAI from 'openai';

// Debug log to check environment variables
const envKey = process.env.OPENAI_API_KEY;
console.log('Environment variables:', {
  OPENAI_API_KEY_PREFIX: envKey ? envKey.slice(0, 7) : 'not found',
  NODE_ENV: process.env.NODE_ENV,
});

// Ensure we're using the correct key from .env.local
const OPENAI_API_KEY = 'sk-BIWJeQSHTX6qpCoJAfw7xaoJM6pGcKb2ryVuweB4LZT3BlbkFJH97MoZCN7jSNuSSIGZ3y65D-c_fIjQJZ5XtuEcdVsA';

if (!OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
}); 