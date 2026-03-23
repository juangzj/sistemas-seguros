import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import 'dotenv/config';

// Configuración para obtener el directorio actual (necesario al usar módulos ES6)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// MIDDLEWARES
// 1. Permite que Express entienda datos de formularios (URL encoded)
app.use(express.urlencoded({ extended: true }));

// 2. Permite que Express entienda JSON 
app.use(express.json());

// 3. Servir archivos estáticos (HTML, CSS, JS del cliente) desde la carpeta 'public'
// Esto hace que si vas a http://localhost:3000/login.html, funcione automáticamente.
app.use(express.static(path.join(__dirname, '../public')));

// RUTAS
// Todas las rutas definidas en authRoutes empezarán por /auth
// Ejemplo: POST /auth/login
app.use('/auth', authRoutes);

// Ruta base para redirigir al login si entras a la raíz
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
    console.log(`-----------------------------------------`);
    console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`⚠️  ADVERTENCIA: Aplicación vulnerable para pruebas.`);
    console.log(`-----------------------------------------`);
});