import pg from 'pg';

// Extraemos las variables del .env
const pool = new pg.Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT 
});

// Verificamos la conexión
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error adquiriendo el cliente', err.stack);
  }
  console.log("Conectado a PostgreSQL (Pool)");
  release(); // Liberamos el cliente de vuelta al pool
});

export default pool;