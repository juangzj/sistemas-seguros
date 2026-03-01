import db from '../config/db.js';

export const findUserInsecure = (username, password, callback) => {
  // VULNERABILIDAD: Concatenación directa de variables en el query
  const query = `SELECT * FROM usuarios WHERE username = '${username}' AND password = '${password}'`;
  
  console.log("Ejecutando query:", query); // Para que veas la inyección en consola
  db.query(query, callback);
};

export const createUserInsecure = (username, password, callback) => {
  const query = `INSERT INTO usuarios (username, password) VALUES ('${username}', '${password}')`;
  db.query(query, callback);
};


export const getAllUsers = (callback) => {
  const query = `SELECT id, username, password FROM usuarios`;
  db.query(query, callback);
};


// 🔴 Ejecutar SQL manual (ULTRA inseguro)
export const executeRawQuery = (sql, callback) => {
  console.log("Ejecutando SQL Manual:", sql);
  db.query(sql, callback);
};

// 🔴 Barra de búsqueda vulnerable
export const searchUsersInsecure = (search, callback) => {

  let query;

  if (!search || search.trim() === "") {
    query = "SELECT * FROM usuarios";
  } else {
    // 🔥 Vulnerabilidad intencional
    query = `SELECT * FROM usuarios WHERE username = '${search}'`;
  }

  console.log("Ejecutando búsqueda vulnerable:", query);
  db.query(query, callback);
};


