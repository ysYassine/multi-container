import axios from 'axios';
import { configDotenv } from 'dotenv';
import express from 'express';

configDotenv();

const apiKey = process.env['API_KEY'];
const privateMicroserviceUrl = process.env['PRIVATE_MICROSERVICE_URL'];

function useApi() {
  return axios.get(`${privateMicroserviceUrl}/api`, {
    headers: {
      authorization: apiKey,
    },
  });
}

const app = express();

app.get('/test', async (_, res) => {
  try {
    const response = await useApi();
    res.send(response.data);
  } catch {
    res.status(401).send({ error: 'Unauthorized' });
  }
});

const port = 3100;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
server.on('error', console.error);

useApi()
  .then((res) => console.log(res.data))
  .catch((err) => console.error({ message: err.message, status: err.status }));
