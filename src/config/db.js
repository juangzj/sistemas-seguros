import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: 'admin',  
  database: 'lab_seguridad',
  multipleStatements: true
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Conectado a MySQL");
});

export default connection;