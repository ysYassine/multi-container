import { configDotenv } from 'dotenv';
import express from 'express';

configDotenv();
const adminUsername = process.env['ADMIN_USERNAME'];
const adminPassword = process.env['ADMIN_PASSWORD'];

const knownApiKeys = new Set<string>();

function generateApiKey(): Promise<string> {
  return new Promise((resolve) => {
    // Simulate a delay in generating an API key
    setTimeout(() => {
      const apiKey = Math.random().toString(36).substring(2);
      resolve(apiKey);
    }, 5000);
  });
}

const app = express();

app.post('/api-keys', async (req, res) => {
  const { username, password } = req.body ?? {};
  if (username === adminUsername && password === adminPassword) {
    const apiKey = await generateApiKey();
    knownApiKeys.add(apiKey);
    res.send({ apiKey });
    return;
  }

  res.status(401).send({ error: 'Unauthorized' });
});

app.get('/health', (_, res) => {
  res.send({ status: 'ok' });
});

app.get('/api', (req, res) => {
  const apiKey = req.headers['authorization'] as string;
  if (knownApiKeys.has(apiKey)) {
    res.send({ message: 'API is accessible' });
    return;
  }

  res.status(401).send({ error: 'Unauthorized' });
});

const port = 3000;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
server.on('error', console.error);
