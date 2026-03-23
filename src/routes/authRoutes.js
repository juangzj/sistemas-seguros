import express from 'express';
import { login, register, logout, listUsers, findUsers } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout);
router.get('/users-list', listUsers); 
router.get('/buscar', findUsers);

export default router;