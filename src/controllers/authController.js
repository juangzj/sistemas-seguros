import * as UserModel from '../models/userModel.js';
import redisClient from '../config/redis.js'; 
import { v4 as uuidv4 } from 'uuid'; 

export const login = async (req, res) => {
    const { username, password } = req.body;

    UserModel.findUser(username, password, async (err, results) => {
        if (err || !results || results.length === 0) {
            return res.status(401).send("<script>alert('Credenciales inválidas'); window.location='/login.html';</script>");
        }

        const user = results[0];
        const token = uuidv4(); 

        try {
            await redisClient.set(token, user.id.toString(), {
                EX: 3600
            });

            res.cookie('session_token', token, { httpOnly: true });
            res.redirect('/dashboard.html');
        } catch (redisErr) {
            console.error("Error en Redis:", redisErr);
            res.status(500).send("Error de servidor");
        }
    });
};

export const register = (req, res) => {
    const { username, password } = req.body;
    UserModel.createUser(username, password, async (err) => {
        if (err) {
            console.error("DETALLE DEL ERROR:", err); 
            return res.status(500).send("Error al registrar");
        }
        // Invalida el caché de la lista al registrar un nuevo usuario
        await redisClient.del('users:all');
        res.send("<script>alert('Registrado con éxito'); window.location='/login.html';</script>");
    });
};

export const logout = async (req, res) => {
    const token = req.cookies?.session_token;
    if (token) {
        await redisClient.del(token); 
    }
    res.clearCookie('session_token');
    res.redirect('/login.html');
};

// Implementación de Caché para demostrar velocidad
export const listUsers = async (req, res) => {
    const cacheKey = 'users:all';

    try {
        const cachedUsers = await redisClient.get(cacheKey);
        if (cachedUsers) {
            return res.json({ source: 'Redis (Cache)', data: JSON.parse(cachedUsers) });
        }

        UserModel.getAllUsers(async (err, results) => {
            if (err) return res.status(500).json({ error: "Error" });
            
            // Guardamos en caché por 60 segundos
            await redisClient.set(cacheKey, JSON.stringify(results), { EX: 60 });
            res.json({ source: 'PostgreSQL (DB)', data: results });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const findUsers = (req, res) => {
    const { search } = req.query;
    UserModel.searchUsers(search, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ status: "Éxito", results });
    });
};