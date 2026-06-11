# S2_ATW — Sistema de Reserva de Salas

## Versiones Utilizadas

| Herramienta | Versión |
|---|---|
| Java | 17 (Temurin) |
| Node.js | 20.x |
| npm | 10.x |
| Angular CLI | 17.3 |
| PostgreSQL | 14+ |
| Maven | 3.8+ (o `./mvnw`) |

## 1. Crear Base de Datos

```batch
psql -U postgres -c "CREATE DATABASE demo01;"
```

## 2. Poblar Base de Datos (opcional, primera vez)

```batch
psql -U postgres -d demo01 -f data.sql
```

## 3. Levantar Backend

```batch
cd Backend
.\mvnw spring-boot:run
```

El backend arranca en `http://localhost:6789/api`.

## 4. Levantar Frontend

```batch
cd Frontend
npm start
```

El frontend arranca en `http://localhost:4200`.

## Cuenta de Prueba

| Correo | Contraseña |
|---|---|
| `test@test.cl` | `1234` |
