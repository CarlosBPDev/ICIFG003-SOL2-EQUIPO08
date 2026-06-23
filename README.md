# S2_ATW — Sistema de Reserva de Salas

## Versiones Utilizadas

| Herramienta | Versión |
|---|---|
| Java | 17 (Temurin) |
| Node.js | 20.x |
| npm | 10.x |
| Angular CLI | 17.3 |
| MySQL | 8.0+ |
| Maven | 3.8+ (o `./mvnw`) |

## 1. Crear Base de Datos

```batch
mysql -u root -e "CREATE DATABASE demo01;"
```

## 2. Poblar Base de Datos (opcional, primera vez)

La base de datos se puebla automáticamente al iniciar el backend mediante
`data.sql` (DML semilla). No es necesario ejecutarlo manualmente.

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
