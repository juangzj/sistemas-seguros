# 🛡️ Guía de Mitigación: Vulnerabilidad SQL Injection

Este documento explica por qué el código actual es vulnerable y cómo implementar la solución definitiva utilizando **Sentencias Preparadas (Prepared Statements)**.

## 1. El Problema: Concatenación de Strings

En el archivo `userModel.js`, el código construye la consulta uniendo directamente las entradas del usuario con la cadena de SQL:

```javascript
const query = `SELECT * FROM usuarios WHERE username = '${username}' AND password = '${password}'`;
```

### ¿Cómo funciona el ataque?

Cuando un atacante utiliza la siguiente entrada maliciosa:

```sql
' OR 1=1 -- 
```

El motor de la base de datos recibe lo siguiente:

```sql
SELECT * FROM usuarios WHERE username = '' OR 1=1 --' AND password = '...'
```

- `' OR 1=1 ` → Hace que la condición sea siempre verdadera, saltándose la validación.
- `--` → Comenta el resto de la consulta, anulando la verificación de la contraseña.

## 2. Barra de busqueda insegura 

Debido a que existe una función para la busqueda de usuarios vulnerable

```javascript
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

```
Se puede realizar los siguientes ataques


* Eliminación de tablas

```sql
'; DROP TABLE usuarios; -- 
```

* Robo de contraseñas

```sql
' UNION SELECT username, password FROM usuarios --
```

* Creación de nuevo usuario

```sql
'; INSERT INTO usuarios(username,password) VALUES('hacker','123'); -- 
```

## 3. La Solución: Sentencias Preparadas

Para arreglar este error, debemos dejar de concatenar variables.  
En su lugar, utilizamos **marcadores de posición (`?`)**.

Al usar marcadores, los datos enviados por el usuario son tratados estrictamente como **datos (texto plano)** y nunca como **código ejecutable**.

## Código Corregido (`src/models/userModel.js`)

```javascript
import db from '../config/db.js';

/**
 * BUSCAR USUARIO (SEGURO)
 * Se utiliza el método .execute() y parámetros ? para prevenir inyecciones.
 */
export const findUserSecure = (username, password, callback) => {
  const query = `SELECT * FROM usuarios WHERE username = ? AND password = ?`;
  
  // Los valores se pasan en un array por separado
  db.execute(query, [username, password], callback);
};

/**
 * CREAR USUARIO (SEGURO)
 */
export const createUserSecure = (username, password, callback) => {
  const query = `INSERT INTO usuarios (username, password) VALUES (?, ?)`;
  
  db.execute(query, [username, password], callback);
};

/**
 * OBTENER USUARIOS
 */
export const getAllUsers = (callback) => {
  const query = `SELECT id, username, password FROM usuarios`;
  db.query(query, callback);
};

// ✅ Barra de búsqueda segura
export const searchUsersSecure = (search, callback) => {

  let query;
  let valores = [];

  if (!search || search.trim() === "") {
    query = "SELECT * FROM usuarios";
  } else {
    // ✅ Consulta parametrizada
    query = "SELECT * FROM usuarios WHERE username = ?";
    valores.push(search);
  }

  console.log("Ejecutando búsqueda segura:", query);

  db.query(query, valores, callback);
};
```


## Notas

* Para abrir el visualizador se utilzia el comando ctrl + shift + v

* Creación de la base de datos 

```sql
CREATE DATABASE lab_seguridad;
USE lab_seguridad;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(50)
);

-- Insertamos un usuario para probar el login "legal"
INSERT INTO usuarios (username, password) VALUES ('admin', '12345');

select * from usuarios;
```


