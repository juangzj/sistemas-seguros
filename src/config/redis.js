import { createClient } from 'redis';
import 'dotenv/config';

const host = process.env.REDIS_HOST || 'localhost';
const port = process.env.REDIS_PORT || 6379;

const client = createClient({
    url: `redis://${host}:${port}`
});

client.on('error', (err) => console.error('Redis Client Error', err));

await client.connect();

export default client;