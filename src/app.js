import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

// Importación de rutas y el Middleware de protección
import authRoutes from './routes/authRoutes.js';
import { protectRoute } from './middlewares/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARES ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// --- PROTECCIÓN DE ARCHIVOS ESPECÍFICOS ---

// Esta ruta intercepta la petición al dashboard antes de que express.static la encuentre.
// Si el token no está en Redis, el middleware redirige al login.
app.get('/dashboard.html', protectRoute, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// --- ARCHIVOS ESTÁTICOS ---
// Servimos el resto (login, css, js público) normalmente.
app.use(express.static(path.join(__dirname, '../public')));


// --- RUTAS DE API ---
app.use('/auth', authRoutes);

// Redirección inicial
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).send('Archivo no encontrado');
});

// --- INICIAR SERVIDOR ---
app.listen(PORT, () => {
    console.log(`-------------------------------------------------`);
    console.log(`🚀 Servidor iniciado con éxito`);
    console.log(`🌍 URL: http://localhost:${PORT}`);
    console.log(`🛡️  Ruta Protegida: /dashboard.html (vía Redis)`);
    console.log(`-------------------------------------------------`);
});