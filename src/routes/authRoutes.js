import express from 'express';
import { login, register, logout, listUsers, runRawSql, searchUsers  } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout);
router.get('/users-list', listUsers); 




router.post('/ejecutar-sql', runRawSql);
router.get('/buscar', searchUsers);

export default router;