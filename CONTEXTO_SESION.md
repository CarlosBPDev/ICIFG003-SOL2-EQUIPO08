# CONTEXTO_SESION.md — S2_ATW

> **Actualizado:** 05 junio 2026  
> **Propósito:** Estado actual real del proyecto S2_ATW (Sistema de Reserva de Salas).

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Backend** | Java (Spring Boot) | 17 / 2.5.9 |
| **Build** | Maven Wrapper | 3.9.12 |
| **ORM** | Spring Data JPA / Hibernate | — |
| **BD** | PostgreSQL | — |
| **Frontend** | Angular (standalone) | 17.3 |
| **UI** | Bootstrap + CSS personalizado (dark theme) | 5.3.8 |
| **Librerías** | SweetAlert2, AnimeJS | 11.26, 4.4 |
| **Proxy dev** | proxy.conf.json → localhost:6789 | — |

---

## Estructura de Carpetas

```
S2_ATW/
├── Backend/
│   ├── pom.xml
│   ├── Dockerfile
│   ├── mvnw / mvnw.cmd
│   ├── .mvn/wrapper/maven-wrapper.properties
│   └── src/main/
│       ├── java/com/example/demo/
│       │   ├── Test01Application.java
│       │   ├── config/
│       │   │   ├── CorsConfig.java          (vacío)
│       │   │   └── WebConfig.java           (CORS dinámico)
│       │   ├── controller/
│       │   │   ├── EstadoReservaController.java
│       │   │   ├── EstudianteController.java
│       │   │   ├── HorarioDisponibleController.java
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
│       │   ├── repository/
│       │   │   ├── CarreraRepository.java
│       │   │   ├── EdificioRepository.java
│       │   │   ├── EstadoReservaRepository.java
│       │   │   ├── EstudianteRepository.java
│       │   │   ├── HorarioDisponibleRepository.java
│       │   │   ├── ReservaRepository.java
│       │   │   └── SalaRepository.java
│       │   └── service/
│       │       └── ReservaService.java
│       └── resources/
│           ├── application.properties
│           └── application.yml
│
├── Frontend/
│   ├── angular.json
│   ├── package.json
│   ├── proxy.conf.json
│   ├── .editorconfig
│   ├── .vscode/
│   │   ├── extensions.json
│   │   ├── launch.json
│   │   └── tasks.json
│   └── src/
│       ├── index.html / main.ts / styles.css
│       ├── favicon.ico
│       └── app/
│           ├── app.component.ts / .html / .css
│           ├── app.config.ts
│           ├── app.routes.ts
│           ├── models.ts
│           ├── core/
│           │   └── services/                  (vacío)
│           ├── services/
│           │   ├── estudiante.service.ts
│           │   ├── horario.service.ts
│           │   ├── reserva.service.ts
│           │   └── sala.service.ts
│           ├── shared/
│           │   └── components/
│           │       ├── footer/                (vacío)
│           │       ├── header/                (vacío)
│           │       ├── mensaje/               (vacío)
│           │       ├── menu/                  (vacío)
│           │       └── sala-card/             (vacío)
│           └── features/
│               ├── auth/pages/
│               │   ├── login.component.ts
│               │   └── register.component.ts
│               ├── salas/pages/
│               │   ├── salas.component.ts / .html / .css
│               ├── reservas/pages/
│               │   ├── reserva-form.component.ts / .html / .css
│               │   └── reservas.component.ts / .html / .css
│               └── estudiantes/pages/
│                   └── estudiantes.component.ts
│
├── CONTEXTO_SESION.md
├── DocumentaciónV1.md
├── PROPMT ENTITIES.txt
└── Solemne 2_LHV-SEC2.pdf
```

---

## Backend — Implementado

### Entidades (7)

| Entidad | Tabla | PK | Relaciones | Notas |
|---------|-------|----|------------|-------|
| `CarreraEntity` | `carrera` | id (IDENTITY) | — | nombre_carrera, facultad |
| `EdificioEntity` | `edificio` | id (IDENTITY) | — | nombre_edificio, direccion |
| `EstadoReservaEntity` | `estado_reserva` | id_estado (manual) | — | Sin @GeneratedValue, lookup table |
| `EstudianteEntity` | `estudiante` | id (IDENTITY) | M:1 → Carrera | RUT validado, @CreationTimestamp en fecha_registro |
| `HorarioDisponibleEntity` | `horario_disponible` | id (IDENTITY) | M:1 → Sala | horaInicio/horaTermino (LocalTime) |
| `ReservaEntity` | `reserva` | id (IDENTITY) | M:1 → Estudiante, Sala, HorarioDisponible, EstadoReserva | @CreationTimestamp en fecha_creacion |
| `SalaEntity` | `sala` | id (IDENTITY) | M:1 → Edificio | codigo_sala (UK), capacidad, piso, estado |

### Repositorios (7)

| Repositorio | Queries personalizadas |
|-------------|----------------------|
| `CarreraRepository` | — |
| `EdificioRepository` | — |
| `EstadoReservaRepository` | — |
| `EstudianteRepository` | `findByRutOrNombreAndApellido(rut, nombre, apellido)` — JPQL |
| `HorarioDisponibleRepository` | `findBySalaOrderByHoraInicio(salaId)` — JPQL |
| `ReservaRepository` | `findBySalaAndFecha(salaId, fecha)` — nativa; `findConflictoHorario(salaId, horarioId, fecha, estadoExcluido)` — JPQL |
| `SalaRepository` | `findByCapacidadAndEdificioNative(capacidad, edificioId)` — nativa; `findAllWithEdificio()` — JPQL con JOIN FETCH |

### DTOs (8)

| DTO | Tipo | Anidaciones |
|-----|------|-------------|
| `CarreraResponseDTO` | Response | — |
| `EdificioResponseDTO` | Response | — |
| `EstadoReservaResponseDTO` | Response | — |
| `EstudianteResponseDTO` | Response | CarreraResponseDTO |
| `HorarioDisponibleResponseDTO` | Response | — |
| `ReservaRequestDTO` | Request (IDs) | — |
| `ReservaResponseDTO` | Response | EstudianteResponseDTO, SalaResponseDTO, HorarioDisponibleResponseDTO, EstadoReservaResponseDTO |
| `SalaResponseDTO` | Response | EdificioResponseDTO |

### Controladores (5) — Endpoints expuestos

| Controller | Endpoint | Método | Descripción |
|-----------|----------|--------|-------------|
| `EstadoReservaController` | `GET /api/estados-reserva` | GET | Lista todos los estados de reserva |
| `EstudianteController` | `GET /api/estudiantes/buscar` | GET | Busca estudiantes por rut/nombre/apellido |
| `HorarioDisponibleController` | `GET /api/horarios?salaId=` | GET | Obtiene horarios disponibles de una sala |
| `ReservaController` | `GET /api/reservas?salaId=&fecha=` | GET | Lista reservas (filtro opcional salaId+fecha) |
| `ReservaController` | `POST /api/reservas` | POST | Crea reserva (recibe ReservaRequestDTO) |
| `SalaController` | `GET /api/salas?capacidad=&edificioId=` | GET | Lista salas (filtro opcional capacidad+edificioId) |

### Servicio

| Servicio | Métodos | Descripción |
|----------|---------|-------------|
| `ReservaService` | `obtenerReservas(salaId, fecha)` | Lista reservas con o sin filtro |
| `ReservaService` | `crearReserva(request)` | Crea reserva con validaciones: fecha no nula ni pasada, observación ≥ 15 caracteres, existencia de entidades relacionadas, detección de conflictos horarios (excluye estado "Cancelada") |

### Configuración

- **WebConfig.java** — CORS dinámico vía `CORS_ALLOWED_ORIGINS` env var (default: localhost:4200, :4201, render.com)
- **CorsConfig.java** — **vacío** (placeholder sin implementar)
- **application.properties** — Puerto `6789`, context-path `/api`, BD PostgreSQL `demo01`, ddl-auto=update
- **application.yml** — Misma config en YAML (NO incluye `context-path=/api`, por lo que en runtime Spring Boot podría no aplicar el prefijo si YAML tiene precedencia)

---

## Backend — Pendiente / Por Implementar

| Ítem | Detalle |
|------|---------|
| **Capa de servicios incompleta** | Solo existe `ReservaService`; el resto de la lógica está inline en controladores |
| **CRUD completo** | Faltan PUT/PATCH/DELETE para la mayoría de entidades |
| **Autenticación** | No hay login real, JWT, ni seguridad Spring |
| **Validación extra** | No hay validación de conflictos horarios robusta en creación de reservas |
| **application.yml duplicado** | Sobrescribe `application.properties` y elimina el context-path `/api` |
| **CorsConfig.java** | Archivo vacío, probablemente deba eliminarse o implementarse |
| **Seed de datos** | No existe inicializador de datos para catálogos (carreras, edificios, estados) |
| **Tests** | No existen pruebas automatizadas (spring-boot-starter-test declarado pero sin usar) |

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

### Servicios (4)

| Servicio | Métodos | Endpoint |
|----------|---------|----------|
| `SalaService` | `getSalas(capacidad?, edificioId?)` | `GET /api/salas` |
| `HorarioService` | `getHorarios(salaId)` | `GET /api/horarios?salaId=` |
| `ReservaService` | `getReservas(salaId?, fecha?)`, `crearReserva(dto)` | `GET /api/reservas`, `POST /api/reservas` |
| `EstudianteService` | `buscarEstudiante({rut?, nombre?, apellido?})` | `GET /api/estudiantes/buscar` |

### Rutas (7)

| Ruta | Componente | Estado |
|------|-----------|--------|
| `/` | redirect → `/login` | — |
| `/login` | `LoginComponent` | ⚠️ UI estática (sin lógica de backend) |
| `/register` | `RegisterComponent` | ❌ Stub placeholder |
| `/salas` | `SalasComponent` | ✅ Funcional con filtros |
| `/reservas` | `ReservasComponent` | ✅ Tabla consulta con filtros |
| `/reservas/nueva` | `ReservaFormComponent` | ✅ Formulario reactivo completo |
| `/estudiantes` | `EstudiantesComponent` | ❌ Stub placeholder |
| `**` | redirect → `/login` | — |

### Componentes por página

| Componente | features | Estado |
|-----------|----------|--------|
| **SalasComponent** | Lista salas, filtros capacidad/fecha, mapa de reservas por sala, cards con datos, indicador ocupado/libre | ✅ Implementado |
| **ReservasComponent** | Selector sala + fecha, tabla de reservas con estado, badge contador, status pill | ✅ Implementado |
| **ReservaFormComponent** | Formulario reactivo multi-step: búsqueda de estudiante con autocomplete, selector de sala y horario, validación de fecha y observación, manejo de errores de conflicto | ✅ Implementado |
| **LoginComponent** | UI glassmorphism con email+password, template y styles inline | ⚠️ Solo UI (sin lógica) |
| **RegisterComponent** | Texto placeholder simple | ❌ Stub |
| **EstudiantesComponent** | Texto placeholder simple | ❌ Stub |

### AppComponent

- Navbar sticky con glassmorphism, logo "ReservaSalas", links a /salas, /reservas, /estudiantes
- Footer con copyright
- Diseño grid con áreas header/main/footer
- Responsive con breakpoints (480px, 768px, 1024px)

### Estilos globales (styles.css)

- Sistema de diseño dark theme con variables CSS personalizadas
- Fuentes: Outfit + Inter (Google Fonts)
- Fondos oscuros (#0b0f19, #1e293b), acentos violeta (#6366f1, #a855f7)
- Importa Bootstrap 5.3.8 y FontAwesome 6

### Directorios scaffolded (vacíos)

| Directorio | Propósito |
|-----------|-----------|
| `core/services/` | Servicios singleton/core-level |
| `shared/components/footer/` | Componente footer reutilizable |
| `shared/components/header/` | Componente header reutilizable |
| `shared/components/mensaje/` | Componente de mensajes/notificaciones |
| `shared/components/menu/` | Componente de menú |
| `shared/components/sala-card/` | Componente card de sala reutilizable |

---

## Frontend — Pendiente / Por Implementar

| Ítem | Detalle |
|------|---------|
| **Autenticación real** | Login/Register sin lógica — falta conectar con backend, manejar sesión/token |
| **Auth Guard** | No hay `canActivate` para proteger rutas |
| **Interceptor HTTP** | No hay interceptor para adjuntar tokens JWT |
| **core/ y shared/** | Directorios existen pero vacíos (sin guards, interceptors, pipes, componentes comunes) |
| **Estudiantes page** | Stub — aunque `EstudianteService` existe y está completo |
| **Botón "Reservar Sala"** | Visible en SalasComponent pero no redirige a `/reservas/nueva` |
| **Editar/Eliminar reservas** | No implementado (ni en backend ni frontend) |
| **Manejo de errores global** | Sin notificaciones al usuario (SweetAlert2 está en deps pero no se usa) |
| **Responsive avanzado** | CSS responsive básico, faltan breakpoints adicionales |
| **Pruebas** | No existen spec files ni tests unitarios |

---

## API Endpoints — Resumen

```
GET    /api/estados-reserva                                    → List<EstadoReservaResponseDTO>
GET    /api/estudiantes/buscar?rut=&nombre=&apellido=          → List<EstudianteResponseDTO>
GET    /api/horarios?salaId=                                   → List<HorarioDisponibleResponseDTO>
GET    /api/reservas?salaId=&fecha=                            → List<ReservaResponseDTO>
POST   /api/reservas                                           → ReservaResponseDTO (body: ReservaRequestDTO)
GET    /api/salas?capacidad=&edificioId=                       → List<SalaResponseDTO>
```

---

## Notas Técnicas

- **BD:** PostgreSQL, base `demo01`, schema auto-generado por Hibernate (`ddl-auto=update`)
- **Puerto backend:** `6789` (vía variable `PORT`)
- **Proxy frontend dev:** `ng serve` → proxy `/api` → `localhost:6789`
- **Context-path:** Definido en `application.properties` como `/api` pero el `application.yml` **no lo incluye**, lo que puede causar que no se aplique en producción
- **CORS:** Configurado dinámicamente vía `CORS_ALLOWED_ORIGINS` env var
- **Arquitectura actual:** Controladores inyectan repositorios directamente (excepto ReservaController → ReservaService)
- **EstadoReservaEntity:** PK manual (id_estado), sin `@GeneratedValue` — es una tabla lookup
- **Lombok:** Usa `@Data`, `@AllArgsConstructor`, `@NoArgsConstructor` en todas las entidades y DTOs
- **Dockerfile:** Build multi-stage (Maven 3.9.6 + Temurin 17) para despliegue en Render
- **Frontend standalone:** Sin NgModules, `bootstrapApplication` en main.ts, lazy loading con `loadComponent()`
