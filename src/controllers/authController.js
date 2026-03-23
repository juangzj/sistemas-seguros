import * as UserModel from '../models/userModel.js';
import redisClient from '../config/redis.js'; // Necesitarás crear este archivo
import { v4 as uuidv4 } from 'uuid'; // Para generar tokens únicos

export const login = async (req, res) => {
    const { username, password } = req.body;

    UserModel.findUser(username, password, async (err, results) => {
        if (err || !results || results.length === 0) {
            return res.status(401).send("<script>alert('Credenciales inválidas'); window.location='/login.html';</script>");
        }

        const user = results[0];
        const token = uuidv4(); // Generamos un token aleatorio

        try {
            // Guardamos en Redis: Key = token, Value = ID del usuario
            // EX 3600 hace que el token expire en 1 hora (3600 segundos)
            await redisClient.set(token, user.id.toString(), {
                EX: 3600
            });

            // Enviamos el token al cliente (puedes usar cookies o respuesta JSON)
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
    UserModel.createUser(username, password, (err) => {
        if (err) {
            console.error("DETALLE DEL ERROR:", err); 
            return res.status(500).send("Error al registrar");
        }
        res.send("<script>alert('Registrado con éxito'); window.location='/login.html';</script>");
    });
};

export const logout = async (req, res) => {
    const token = req.cookies?.session_token;
    if (token) {
        await redisClient.del(token); // Borramos la sesión de Redis
    }
    res.clearCookie('session_token');
    res.redirect('/login.html');
};

export const listUsers = (req, res) => {
    UserModel.getAllUsers((err, results) => {
        if (err) return res.status(500).json({ error: "Error" });
        res.json(results);
    });
};

export const findUsers = (req, res) => {
    const { search } = req.query;
    UserModel.searchUsers(search, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ status: "Éxito", results });
    });
};