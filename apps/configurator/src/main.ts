import { configDotenv } from 'dotenv';
import * as fs from 'fs/promises';
import axios from 'axios';

configDotenv();

const adminUsername = process.env['ADMIN_USERNAME'];
const adminPassword = process.env['ADMIN_PASSWORD'];
const privateMicroserviceUrl = process.env['PRIVATE_MICROSERVICE_URL'];

async function generateApiKey(): Promise<string> {
  const res = await axios.post(`${privateMicroserviceUrl}/api-keys`, {
    username: adminUsername,
    password: adminPassword,
  });
  return res.data.apiKey;
}

async function saveApiKey(apiKey: string): Promise<void> {
  await fs.mkdir('.api-key', { recursive: true });
  await fs.writeFile('.api-key/.env', `export API_KEY=${apiKey}`, {
    flag: 'w+',
  });
}

async function configure(): Promise<void> {
  await fs.rm('.api-key/.env', { force: true });
  const apiKey = await generateApiKey();
  await saveApiKey(apiKey);
  console.log('API key generated and saved');
}

configure();
