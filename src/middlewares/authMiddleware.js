import redisClient from '../config/redis.js';

export const protectRoute = async (req, res, next) => {
    // 1. Extraer el token de la cookie que definimos en el login
    const token = req.cookies?.session_token;

    if (!token) {
        return res.redirect('/login.html');
    }

    try {
        // 2. Buscar el token en Redis
        const userId = await redisClient.get(token);

        if (!userId) {
            // Si el token no está en Redis (expiró o se borró), limpiar cookie y sacar al usuario
            res.clearCookie('session_token');
            return res.redirect('/login.html');
        }

        // 3. Si existe, guardamos el ID en el request por si lo necesitamos y seguimos
        req.userId = userId;
        next();
    } catch (error) {
        console.error("Error en el middleware de Redis:", error);
        res.status(500).send("Error interno de sesión");
    }
};