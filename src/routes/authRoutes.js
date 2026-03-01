import express from 'express';
// IMPORTANTE: Añade runRawSql aquí
import { login, register, logout, listUsers, runRawSql, searchUsers  } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout);
router.get('/users-list', listUsers); 



// 🔴 Consola manual
router.post('/ejecutar-sql', runRawSql);

// 🔴 Búsqueda vulnerable
router.get('/buscar', searchUsers);

export default router;