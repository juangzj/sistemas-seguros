import db from '../config/db.js';

export const findUser = (username, password, callback) => {
  const query = `SELECT * FROM users WHERE username = $1 AND password = $2`;
  db.query(query, [username, password], (err, res) => {
    callback(err, res ? res.rows : null);
  });
};

export const createUser = (username, password, callback) => {
  const query = `INSERT INTO users (username, password) VALUES ($1, $2)`;
  db.query(query, [username, password], (err, res) => {
    callback(err, res);
  });
};

export const getAllUsers = (callback) => {
  const query = `SELECT id, username FROM users`; 
  db.query(query, (err, res) => {
    callback(err, res ? res.rows : null);
  });
};

export const searchUsers = (search, callback) => {
  let query;
  let params = [];

  if (!search || search.trim() === "") {
    query = "SELECT id, username FROM users";
  } else {
    query = `SELECT id, username FROM users WHERE username ILIKE $1`;
    params = [`%${search}%`];
  }

  db.query(query, params, (err, res) => {
    callback(err, res ? res.rows : null);
  });
};