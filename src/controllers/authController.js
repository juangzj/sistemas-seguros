import * as UserModel from '../models/userModel.js';

export const login = (req, res) => {
    const { username, password } = req.body;
    UserModel.findUserInsecure(username, password, (err, results) => {
        if (err) {
          console.log("Error de SQL:", err); 
          return res.status(500).send("Error");
        }
        if (results.length > 0) {
            // Si el login es exitoso, mandamos al dashboard.html
            res.redirect('/dashboard.html');
        } else {
            res.send("<script>alert('Error'); window.location='/login.html';</script>");
        }
    });
};

// Nueva función para enviar solo los datos de los usuarios
export const listUsers = (req, res) => {
    UserModel.getAllUsers((err, results) => {
        if (err) return res.status(500).json({ error: "Error" });
        res.json(results); // Enviamos los datos como JSON
    });
};

export const logout = (req, res) => res.redirect('/login.html');

export const register = (req, res) => {
    const { username, password } = req.body;
    UserModel.createUserInsecure(username, password, () => {
        res.send("<script>alert('Registrado'); window.location='/login.html';</script>");
    });
};




// 🔴 Consola SQL manual
export const runRawSql = (req, res) => {
    const { sql } = req.body;

    if (!sql) {
        return res.status(400).json({ error: "No se proporcionó ninguna sentencia SQL" });
    }

    UserModel.executeRawQuery(sql, (err, results) => {
        if (err) {
            console.log("Error en ejecución manual:", err);
            return res.status(500).json({ 
                status: "Error de SQL", 
                message: err.message 
            });
        }

        res.json({
            status: "Éxito",
            results: results
        });
    });
};

// 🔴 Búsqueda vulnerable
export const searchUsers = (req, res) => {

    const { search } = req.query;

    UserModel.searchUsersInsecure(search, (err, results) => {
        if (err) {
            console.log("Error en búsqueda:", err);
            return res.status(500).json({
                status: "Error",
                message: err.message
            });
        }

        res.json({
            status: "Éxito",
            results: results
        });
    });
};