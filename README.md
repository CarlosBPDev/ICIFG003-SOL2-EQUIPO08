# S2_ATW — Sistema de Reserva de Salas

Sistema web para reserva de salas de estudio en instituciones educativas.
Backend Spring Boot + Frontend Angular 17.

## Requisitos Previos

| Herramienta | Versión |
|-------------|---------|
| Java | 17 (Temurin recomendado) |
| Node.js | 20.x |
| npm | 10.x |
| Angular CLI | 17.3 (`npm install -g @angular/cli@17`) |
| PostgreSQL | 14+ |
| Maven | 3.8+ (o usar `./mvnw`) |

> El proyecto fue desarrollado y probado en un entorno con **Java 17 Temurin** y **Node.js 20**.

## Configuración de Base de Datos

1. Crear base de datos PostgreSQL:

```sql
CREATE DATABASE demo01;
```

2. Las credenciales por defecto (configuradas en `application.properties`):
   - Usuario: `postgres`
   - Contraseña: `1234`
   - Puerto: `5432`

   Se pueden sobrescribir vía variables de entorno `DB_USERNAME` y `DB_PASSWORD`.

## PostgreSQL

En Windows, iniciar PostgreSQL desde el panel de servicios (Services.msc) o con:

```batch
net start postgresql-x64-17
```

## Levantar Backend

```bash
cd Backend
./mvnw spring-boot:run
```

El backend arranca en `http://localhost:6789/api`.

> Las entidades JPA se crean automáticamente gracias a `spring.jpa.hibernate.ddl-auto=update`.

## Poblar Base de Datos (Seed Data)

```bash
psql -U postgres -d demo01 -f data.sql
```

## Levantar Frontend

```bash
cd Frontend
npm start
```

El frontend arranca en `http://localhost:4200`.
El proxy de desarrollo redirige las llamadas a `/api/*` hacia `http://localhost:6789`.

## Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/estados-reserva` | Lista todos los estados de reserva |
| GET | `/api/estudiantes/buscar?rut=&nombre=&apellido=` | Busca estudiantes por RUT, nombre o apellido |
| GET | `/api/horarios?salaId=` | Obtiene horarios disponibles de una sala |
| GET | `/api/reservas?salaId=&fecha=` | Lista reservas (filtro opcional) |
| POST | `/api/reservas` | Crea una nueva reserva |
| GET | `/api/salas?capacidad=&edificioId=` | Lista salas (filtro opcional) |

## Estructura del Proyecto (resumida)

```
ICIFG003-SOL2-EQUIPO08/
├── Backend/
│   ├── src/main/java/com/example/demo/
│   │   ├── config/          → CORS, configuración
│   │   ├── controller/      → 5 controladores REST
│   │   ├── dto/             → 8 DTOs request/response
│   │   ├── entity/          → 7 entidades JPA
│   │   ├── repository/      → 7 repositorios Spring Data
│   │   └── service/         → ReservaService
│   ├── src/main/resources/  → application.properties / .yml
│   ├── pom.xml
│   └── Dockerfile
├── Frontend/
│   ├── src/app/
│   │   ├── features/        → auth, estudiantes, reservas, salas
│   │   ├── services/        → 4 servicios HTTP
│   │   ├── shared/          → componentes reutilizables
│   │   ├── models.ts        → interfaces TypeScript
│   │   ├── app.routes.ts    → 7 rutas con lazy loading
│   │   └── app.config.ts    → providers (router, http)
│   ├── angular.json
│   └── package.json
├── CONTEXTO_SESION.md       → Estado detallado del proyecto
└── DocumentaciónV1.md       → Documentación v1.0 (03-jun-2026)
```

## Stack Tecnológico

- **Backend:** Java 17, Spring Boot 2.5.9, Spring Data JPA, PostgreSQL, Maven
- **Frontend:** Angular 17.3 standalone, Bootstrap 5.3, TypeScript 5.4
- **Despliegue:** Docker multi-stage (Temurin 17 + JRE), Render.com
