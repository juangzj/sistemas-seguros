# Laboratorio: Tokens con redis

## Inicializar ejecución de la app

### Ejecución de contenedores

```shell
# Usar el siguiente codigo para levantar contendores (postgres /  redis)
sudo docker compose up -d
```

### Ejecución de la app

```shell
# iniciar ejecucion de la app 
node src/app.js
```

### Código de cracion de la base de datos
```sql


create database  "token-redis";

-- Creacion de la tabla users

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Borrar token ingresando al contenedor

```shell

# entrar al contenedor de redis
sudo docker exec -it token-redis-redis redis-cli

# ver keys 
keys *

# borrar tokens 
DEL "2737b447-6d9c-4318-ab90-451653395005" 

# borrar usuarios

DEL "users:all"


# borrar todo de redis
FLUSHALL

# Ver tiempo de expiracion 
TTL "users:all"

# ver los usaurios 
KEYS "users:all"

```