import { configDotenv } from 'dotenv';
import express from 'express';

configDotenv();
const adminUsername = process.env['ADMIN_USERNAME'];
const adminPassword = process.env['ADMIN_PASSWORD'];

const knownApiKeys = new Set<string>();

function generateApiKey(): string {
  return Math.random().toString(36).substring(2);
}

const app = express();

app.post('/api-keys', (req, res) => {
  const { username, password } = req.body ?? {};
  if (username === adminUsername && password === adminPassword) {
    const apiKey = generateApiKey();
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
