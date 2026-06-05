# CONTEXTO_SESION.md — S2_ATW

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Backend** | Java (Spring Boot) | 17 / 2.5.9 |
| **Build** | Maven | wrapper (mvnw) |
| **ORM** | Spring Data JPA / Hibernate | — |
| **BD** | PostgreSQL | — |
| **Frontend** | Angular (standalone) | 17.3 |
| **UI** | Bootstrap + CSS personalizado | 5.3.8 |
| **Librerías** | SweetAlert2, AnimeJS | — |
| **Proxy dev** | proxy.conf.json → localhost:6789 | — |

---

## Estructura de Carpetas

```
S2_ATW/
├── Backend/
│   ├── pom.xml
│   ├── Dockerfile
│   ├── mvnw / mvnw.cmd
│   └── src/main/
│       ├── java/com/example/demo/
│       │   ├── Test01Application.java
│       │   ├── config/
│       │   │   ├── CorsConfig.java          (vací­o)
│       │   │   └── WebConfig.java           (CORS)
│       │   ├── controller/
│       │   │   ├── EstudianteController.java
│       │   │   ├── ReservaController.java
│       │   │   └── SalaController.java
│       │   ├── dto/
│       │   │   ├── CarreraResponseDTO.java
│       │   │   ├── EdificioResponseDTO.java
│       │   │   ├── EstadoReservaResponseDTO.java
│       │   │   ├── EstudianteResponseDTO.java
│       │   │   ├── HorarioDisponibleResponseDTO.java
│       │   │   ├── ReservaRequestDTO.java
│       │   │   ├── ReservaResponseDTO.java
│       │   │   └── SalaResponseDTO.java
│       │   ├── entity/
│       │   │   ├── CarreraEntity.java
│       │   │   ├── EdificioEntity.java
│       │   │   ├── EstadoReservaEntity.java
│       │   │   ├── EstudianteEntity.java
│       │   │   ├── HorarioDisponibleEntity.java
│       │   │   ├── ReservaEntity.java
│       │   │   └── SalaEntity.java
│       │   ├── interfaces/                  (vacío)
│       │   ├── repository/
│       │   │   ├── CarreraRepository.java
│       │   │   ├── EdificioRepository.java
│       │   │   ├── EstadoReservaRepository.java
│       │   │   ├── EstudianteRepository.java
│       │   │   ├── HorarioDisponibleRepository.java
│       │   │   ├── ReservaRepository.java
│       │   │   └── SalaRepository.java
│       │   └── service/                     (vacío)
│       └── resources/
│           ├── application.properties
│           └── application.yml
│
├── Frontend/
│   ├── angular.json
│   ├── package.json
│   ├── proxy.conf.json
│   └── src/
│       ├── index.html / main.ts / styles.css
│       └── app/
│           ├── app.component.ts/.html/.css
│           ├── app.config.ts
│           ├── app.routes.ts
│           ├── models.ts
│           ├── services/
│           │   ├── sala.service.ts
│           │   ├── reserva.service.ts
│           │   └── estudiante.service.ts
│           └── features/
│               ├── auth/pages/
│               │   ├── login.component.ts
│               │   └── register.component.ts
│               ├── salas/pages/
│               │   ├── salas.component.ts/.html/.css
│               ├── reservas/pages/
│               │   ├── reservas.component.ts/.html/.css
│               └── estudiantes/pages/
│                   └── estudiantes.component.ts
│
├── DocumentaciónV1.md
├── PROPMT ENTITIES.txt
└── Solemne 2_LHV-SEC2.pdf
```

---

## Backend — Implementado

### Entidades (7)

| Entidad | Tabla | Relaciones |
|---------|-------|------------|
| `CarreraEntity` | `carrera` | — |
| `EdificioEntity` | `edificio` | — |
| `EstadoReservaEntity` | `estado_reserva` | — |
| `EstudianteEntity` | `estudiante` | M:1 → Carrera |
| `HorarioDisponibleEntity` | `horario_disponible` | M:1 → Sala |
| `ReservaEntity` | `reserva` | M:1 → Estudiante, Sala, HorarioDisponible, EstadoReserva |
| `SalaEntity` | `sala` | M:1 → Edificio |

### Repositorios (7)

| Repositorio | Queries personalizadas |
|-------------|----------------------|
| `CarreraRepository` | — |
| `EdificioRepository` | — |
| `EstadoReservaRepository` | — |
| `EstudianteRepository` | `findByRutOrNombreAndApellido(rut, nombre, apellido)` |
| `HorarioDisponibleRepository` | `findBySalaOrderByHoraInicio(salaId)` |
| `ReservaRepository` | `findBySalaAndFecha(salaId, fecha)` (nativa), `findConflictoHorario(...)` |
| `SalaRepository` | `findByCapacidadAndEdificioNative(capacidad, edificioId)`, `findAllWithEdificio()` |

### DTOs (8)

| DTO | Tipo |
|-----|------|
| `CarreraResponseDTO` | Response |
| `EdificioResponseDTO` | Response |
| `EstadoReservaResponseDTO` | Response |
| `EstudianteResponseDTO` | Response (anida CarreraResponseDTO) |
| `HorarioDisponibleResponseDTO` | Response |
| `ReservaRequestDTO` | Request (usa IDs) |
| `ReservaResponseDTO` | Response (anida Estudiante, Sala, Horario, Estado) |
| `SalaResponseDTO` | Response (anida EdificioResponseDTO) |

### Controladores (3) — Endpoints expuestos

| Controller | Endpoint | Método | Descripción |
|-----------|----------|--------|-------------|
| `EstudianteController` | `GET /api/estudiantes/buscar` | GET | Busca estudiantes por rut/nombre/apellido |
| `ReservaController` | `GET /api/reservas` | GET | Lista reservas, opcional filtro salaId+fecha |
| `ReservaController` | `POST /api/reservas` | POST | Crea reserva (recibe ReservaRequestDTO) |
| `SalaController` | `GET /api/salas` | GET | Lista salas, opcional filtro capacidad+edificioId |

### Configuración

- **WebConfig.java** — CORS: origenes desde `CORS_ALLOWED_ORIGINS` (default localhost:4200, :4201, render.com)
- **CorsConfig.java** — **vacío** (placeholder)
- **application.properties** — Puerto `6789`, context-path `/api`, BD PostgreSQL `demo01`, ddl-auto=update
- **application.yml** — Misma config en YAML (sobrescribe `.properties`, **no incluye** context-path `/api`)

---

## Backend — Pendiente / Por Implementar

| Ítem | Detalle |
|------|---------|
| **Capa de servicios** | `service/` vacío — la lógica de negocio está inline en los controladores |
| **CRUD completo** | Solo existen GET y POST parciales. Faltan PUT/PATCH/DELETE para la mayoría de entidades |
| **Autenticación** | No hay login real, JWT, ni seguridad Spring |
| **Validación extra** | No hay validación de conflictos horarios robusta en creación de reservas |
| **application.yml duplicado** | Sobrescribe `application.properties` y elimina el context-path `/api` |
| **CorsConfig.java** | Archivo vacío, probablemente deba eliminarse o implementarse |

---

## Frontend — Implementado

### Modelos (models.ts — 8 interfaces)

| Interfaz | Uso |
|----------|-----|
| `CarreraResponseDTO` | Datos de carrera |
| `EdificioResponseDTO` | Datos de edificio |
| `EstadoReservaResponseDTO` | Estado de reserva |
| `EstudianteResponseDTO` | Datos de estudiante (anida carrera) |
| `HorarioDisponibleResponseDTO` | Bloque horario |
| `ReservaRequestDTO` | Payload crear reserva |
| `ReservaResponseDTO` | Reserva completa (anida estudiante, sala, horario, estado) |
| `SalaResponseDTO` | Sala (anida edificio) |

### Servicios (3)

| Servicio | Métodos | Endpoint |
|----------|---------|----------|
| `SalaService` | `getSalas(capacidad?, edificioId?)` | `GET /api/salas` |
| `ReservaService` | `getReservas(salaId?, fecha?)`, `crearReserva(dto)` | `GET /api/reservas`, `POST /api/reservas` |
| `EstudianteService` | `buscarEstudiante({rut?, nombre?, apellido?})` | `GET /api/estudiantes/buscar` |

### Rutas (6)

| Ruta | Componente | Estado |
|------|-----------|--------|
| `/login` | `LoginComponent` | UI placeholder (sin lógica) |
| `/register` | `RegisterComponent` | Stub placeholder |
| `/salas` | `SalasComponent` | ✅ Funcional con filtros |
| `/reservas` | `ReservasComponent` | ✅ Tabla consulta |
| `/estudiantes` | `EstudiantesComponent` | Stub placeholder |
| `**` | redirect → `/login` | — |

### Componentes por pá­gina

| Componente | features | Estado |
|-----------|----------|--------|
| **SalasComponent** | Lista salas, filtros capacidad/fecha, mapa de reservas por sala, cards con datos | ✅ Implementado |
| **ReservasComponent** | Selector sala + fecha, tabla de reservas con estado, badge contador | ✅ Implementado |
| **LoginComponent** | Formulario email+password con glassmorphism | ⚠️ Solo UI |
| **RegisterComponent** | Texto placeholder | ❌ Stub |
| **EstudiantesComponent** | Texto placeholder | ❌ Stub |

### AppComponent

- Navbar sticky con glassmorphism, links a /salas, /reservas, /estudiantes
- `<router-outlet>` para renderizado de rutas

---

## Frontend — Pendiente / Por Implementar

| Ítem | Detalle |
|------|---------|
| **Autenticación real** | Login/Register sin lógica — falta conectar con backend, manejar sesión/token |
| **Auth Guard** | No hay `canActivate` para proteger rutas |
| **Interceptor HTTP** | No hay interceptor para adjuntar tokens JWT |
| **core/ y shared/** | Directorios no existen (no hay guards, interceptors, pipes, componentes comunes) |
| **Estudiantes page** | Stub — aunque `EstudianteService` existe y está completo |
| **Botón "Reservar Sala"** | Visible en UI pero desconectado de `crearReserva()` |
| **Editar/Eliminar reservas** | No implementado (ni en backend ni frontend) |
| **Manejo de errores** | Sin notificaciones al usuario (SweetAlert2 está en deps pero no se usa) |
| **Responsive avanzado** | CSS responsive básico, faltan breakpoints adicionales |

---

## API Endpoints — Resumen

```
GET    /api/estudiantes/buscar?rut=&nombre=&apellido=   → List<EstudianteResponseDTO>
GET    /api/reservas?salaId=&fecha=                     → List<ReservaResponseDTO>
POST   /api/reservas                                    → ReservaResponseDTO  (body: ReservaRequestDTO)
GET    /api/salas?capacidad=&edificioId=                → List<SalaResponseDTO>
```

---

## Notas Técnicas

- **BD:** PostgreSQL, base `demo01`, schema auto-generado por Hibernate (`ddl-auto=update`)
- **Puerto backend:** `6789` (vía variable `PORT`)
- **Proxy frontend dev:** `ng serve` → proxy `/api` → `localhost:6789`
- **Context-path:** Definido en `application.properties` como `/api` pero el `application.yml` **no lo incluye**, lo que puede causar que no se aplique en producción
- **CORS:** Configurado dinámicamente vía `CORS_ALLOWED_ORIGINS` env var
- **Arquitectura actual:** Los controladores inyectan repositorios directamente (sin capa de servicios)
