# CONTEXTO_SESION.md — S2_ATW

> **Actualizado:** 08 junio 2026
> **Propósito:** Estado actual real del proyecto S2_ATW (Sistema de Reserva de Salas).
> **Metodología:** Verificado contra el código fuente en Backend/ y Frontend/.

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Backend** | Java (Spring Boot) | 17 / 2.5.9 |
| **Build** | Maven Wrapper | 3.9.12 (wrapper) / 3.8.1 (compiler plugin) |
| **ORM** | Spring Data JPA / Hibernate | — |
| **BD** | PostgreSQL | — (conexión a `demo01`) |
| **Frontend** | Angular (standalone) | 17.3 |
| **UI** | Bootstrap + CSS personalizado (dark theme) | 5.3.8 |
| **Librerías** | SweetAlert2, AnimeJS | 11.26, 4.4 (declaradas, NO usadas) |
| **Proxy dev** | proxy.conf.json → localhost:6789 | — |

---

## Estructura de Carpetas (Real)

```
S2_ATW/
├── .gitignore                          (vacío)
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
│       │   │   └── WebConfig.java           (CORS dinámico vía env var)
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
│   ├── tsconfig.json / tsconfig.app.json / tsconfig.spec.json
│   └── src/
│       ├── index.html / main.ts / styles.css
│       ├── favicon.ico
│       ├── assets/                         (vacío)
│       └── app/
│           ├── app.component.ts / .html / .css
│           ├── app.config.ts
│           ├── app.routes.ts
│           ├── models.ts
│           ├── services/
│           │   ├── estudiante.service.ts
│           │   ├── horario.service.ts
│           │   ├── reserva.service.ts
│           │   └── sala.service.ts
│           ├── features/
│           │   ├── auth/pages/
│           │   │   ├── login.component.ts
│           │   │   └── register.component.ts
│           │   ├── estudiantes/pages/
│           │   │   └── estudiantes.component.ts
│           │   ├── reservas/pages/
│           │   │   ├── reserva-form.component.ts / .html / .css
│           │   │   └── reservas.component.ts / .html / .css
│           │   └── salas/pages/
│           │       ├── salas.component.ts / .html / .css
│           ├── shared/components/
│           │   ├── mensaje/ (standalone, funcional)
│           │   │   ├── mensaje.component.ts / .html / .css
│           │   ├── menu/ (NO standalone — ROTO)
│           │   │   ├── menu.component.ts / .html / .css
│           │   └── sala-card/ (NO standalone — ROTO)
│           │       ├── sala-card.component.ts / .html / .css
│           └── pages/                      (HUÉRFANOS — no referenciados)
│               ├── inicio/
│               │   ├── inicio.component.html / .css
│               └── salas/
│                   ├── salas.component.html / .css
│
├── CONTEXTO_SESION.md
├── DocumentaciónV1.md                     (desactualizada — v1.0 del 03-jun)
├── PROPMT ENTITIES.txt
├── data.sql                               (⚠️ INCOMPATIBLE con entidades actuales)
└── Solemne 2_LHV-SEC2.pdf
```

---

## Backend — Implementado

### Entidades (7)

| Entidad | Tabla | PK | Columnas clave | Relaciones |
|---------|-------|----|----------------|------------|
| `CarreraEntity` | `carrera` | id (IDENTITY) | nombre_carrera, facultad | — |
| `EdificioEntity` | `edificio` | id (IDENTITY) | nombre_edificio, direccion | — |
| `EstadoReservaEntity` | `estado_reserva` | id_estado (manual) | nombre_estado | — (lookup table, sin @GeneratedValue) |
| `EstudianteEntity` | `estudiante` | id (IDENTITY) | rut (UK), nombre, apellido, correo (UK), telefono, fecha_registro (@CreationTimestamp) | M:1 → Carrera (FK: id_carrera) |
| `HorarioDisponibleEntity` | `horario_disponible` | id (IDENTITY) | hora_inicio (LocalTime), hora_termino (LocalTime) | M:1 → Sala (FK: sala_id) |
| `ReservaEntity` | `reserva` | id (IDENTITY) | fecha_reserva (LocalDate), observacion (TEXT), fecha_creacion (@CreationTimestamp) | M:1 → Estudiante, Sala, HorarioDisponible, EstadoReserva |
| `SalaEntity` | `sala` | id (IDENTITY) | codigo_sala (UK), nombre_sala, capacidad, piso, descripcion, estado | M:1 → Edificio (FK: id_edificio) |

**Validaciones:** RUT chileno (`@Pattern("^[0-9]+-[0-9kK]{1}$")`), correo (`@Email`), `@NotNull` en campos obligatorios. Uniques en `rut`, `correo`, `codigo_sala`.

### Repositorios (7)

| Repositorio | Queries personalizadas |
|-------------|----------------------|
| `CarreraRepository` | — |
| `EdificioRepository` | — |
| `EstadoReservaRepository` | — |
| `EstudianteRepository` | `findByRutOrNombreAndApellido(rut, nombre, apellido)` — JPQL |
| `HorarioDisponibleRepository` | `findBySalaOrderByHoraInicio(salaId)` — JPQL |
| `ReservaRepository` | `findBySalaAndFecha(salaId, fecha)` — **nativa**; `findConflictoHorario(salaId, horarioId, fecha, estadoExcluido)` — JPQL |
| `SalaRepository` | `findByCapacidadAndEdificioNative(capacidad, edificioId)` — **nativa**; `findAllWithEdificio()` — JPQL con JOIN FETCH |

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

| Controller | `@RequestMapping` | Endpoint completo | Método | Descripción |
|-----------|------------------|-------------------|--------|-------------|
| `EstadoReservaController` | `/estados-reserva` | `GET /api/estados-reserva` | GET | Lista todos los estados de reserva |
| `EstudianteController` | `/estudiantes` | `GET /api/estudiantes/buscar?rut=&nombre=&apellido=` | GET | Busca estudiantes por rut/nombre/apellido (JPQL) |
| `HorarioDisponibleController` | `/horarios` | `GET /api/horarios?salaId=` | GET | Horarios de una sala (ordenados por hora) |
| `ReservaController` | `/reservas` | `GET /api/reservas?salaId=&fecha=` | GET | Lista reservas con filtro opcional salaId+fecha |
| | | `POST /api/reservas` | POST | Crea reserva (body: ReservaRequestDTO) |
| `SalaController` | `/salas` | `GET /api/salas?capacidad=&edificioId=` | GET | Lista salas con filtro opcional capacidad+edificioId |

### Servicio

| Servicio | Métodos | Descripción |
|----------|---------|-------------|
| `ReservaService` | `obtenerReservas(salaId, fecha)` | Lista reservas (con o sin filtro sala+fecha) |
| `ReservaService` | `crearReserva(request)` | Crea reserva con validaciones: fecha no nula ni pasada, observación ≥ 15 caracteres, existencia de entidades relacionadas, detección de conflictos horarios (excluye estado "Cancelada") |

### Configuración

- **WebConfig.java** — CORS dinámico vía `CORS_ALLOWED_ORIGINS` env var (default: `localhost:4200, :4201, icifg003-eq08.onrender.com`). Usa `allowedOriginPatterns` + `allowCredentials(true)`.
- **CorsConfig.java** — **vacío** (placeholder sin implementar; no afecta porque WebConfig tiene prioridad).
- **application.properties** — Puerto `6789`, context-path `/api`, BD PostgreSQL `demo01`, `ddl-auto=update`.
- **application.yml** — SI omite `server.servlet.context-path=/api` respecto a properties, por lo que en runtime Spring Boot podría no aplicar el prefijo si YAML tiene precedencia sobre properties (⚠️ riesgo en producción).

---

## Backend — Pendiente / Por Implementar

| Ítem | Detalle |
|------|---------|
| **Capa de servicios incompleta** | Solo existe `ReservaService`; el resto de la lógica está inline en controladores (EstadoReserva, Estudiante, HorarioDisponible, Sala inyectan repositorios directamente) |
| **CRUD completo** | Faltan PUT/PATCH/DELETE para todas las entidades |
| **Autenticación/Autorización** | No hay login real, JWT, ni Spring Security |
| **Validación extra** | La validación de conflictos horarios existe en `ReservaService` pero falta robustez (no valida trasapos parcial de bloques, solo igualdad de horarioId) |
| **application.yml duplicado** | Sobrescribe `application.properties` y elimina el `context-path=/api` — puede causar que `/api` no se aplique |
| **CorsConfig.java** | Archivo vacío, debe eliminarse o implementarse |
| **Seed de datos** | No existe inicializador (`CommandLineRunner`, `data.sql` o `import.sql`) para cargar catálogos |
| **Tests** | No existen pruebas automatizadas (`spring-boot-starter-test` declarado pero sin usar) |
| **data.sql** | Archivo presente pero **incompatible** con el schema actual de las entidades (ver sección Hallazgos) |

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

### Rutas (7 definidas en app.routes.ts)

| Ruta | Componente (lazy) | Estado |
|------|-------------------|--------|
| `""` | redirect → `/login` | — |
| `"login"` | `LoginComponent` | ⚠️ UI estática (sin lógica de backend) |
| `"register"` | `RegisterComponent` | ❌ Stub placeholder |
| `"salas"` | `SalasComponent` | ✅ Funcional con filtros |
| `"reservas/nueva"` | `ReservaFormComponent` | ✅ Formulario reactivo completo multi-step |
| `"reservas"` | `ReservasComponent` | ✅ Tabla consulta con filtros (nota: va DESPUÉS de `/nueva` en routes) |
| `"estudiantes"` | `EstudiantesComponent` | ❌ Stub placeholder |
| `"**"` | redirect → `/login` | — |

### Componentes por página

| Componente | features/ | Estado | Detalle |
|-----------|-----------|--------|---------|
| **LoginComponent** | auth/pages/ | ⚠️ Solo UI | Glassmorphism, email+password, template y styles inline. Sin lógica de autenticación |
| **RegisterComponent** | auth/pages/ | ❌ Stub | Texto "Componente temporal de Registro" |
| **SalasComponent** | salas/pages/ | ✅ Funcional | Lista salas, filtros capacidad/fecha, cards con datos, indicador ocupado/libre con reservas del día. Botón "Reservar Sala" visible pero **sin (click) handler** — no navega |
| **ReservasComponent** | reservas/pages/ | ✅ Funcional | Selector sala + fecha, tabla de reservas con badge contador, status pill (Confirmada/Cancelada) |
| **ReservaFormComponent** | reservas/pages/ | ✅ Funcional | Formulario reactivo multi-step: búsqueda estudiante con autocomplete (RUT/nombre), selector sala y horario, validación fecha y observación (≥15 chars), manejo error conflicto. Usa `MensajeComponent` |
| **EstudiantesComponent** | estudiantes/pages/ | ❌ Stub | Texto "Componente temporal de Estudiantes" |

### AppComponent

- Navbar sticky con glassmorphism, logo "ReservaSalas", links a `/salas`, `/reservas`, `/estudiantes`
- Footer con copyright
- Diseño grid con áreas header/main/footer
- Responsive con breakpoints (480px, 768px, 1024px)
- Imports: `RouterOutlet, RouterLink, RouterLinkActive` (standalone)

### Shared Components (3 implementados, 1 standalone funcional + 2 legacy rotos)

| Componente | Tipo | Estado | Detalle |
|-----------|------|--------|---------|
| **MensajeComponent** | standalone | ✅ Funcional | `@Input() tipo: 'exito'|'error'|'advertencia'`, `@Input() texto`. Usado por ReservaFormComponent para errores de conflicto |
| **MenuComponent** | standalone | ✅ Funcional | Convertido a standalone. Template usa `routerLink` vía `RouterModule`. No referenciado desde rutas activas |
| **SalaCardComponent** | standalone | ✅ Funcional | Convertido a standalone. Template referencia campos legacy (`sala.imagen_url`, `sala.bloques`) que no existen en `SalaResponseDTO` actual. No referenciado desde rutas activas |

### Archivos Huérfanos Legacy (pages/)

| Archivo | Propósito | Estado |
|---------|-----------|--------|
| `pages/inicio/inicio.component.html` | Página de inicio antigua (logo biblioteca, `app-menu`, avisos) | 🗑️ No referenciado en rutas |
| `pages/inicio/inicio.component.css` | CSS claro legacy (no dark theme) | 🗑️ No referenciado |
| `pages/salas/salas.component.html` | Grid de `app-sala-card` para listar salas | 🗑️ No referenciado |
| `pages/salas/salas.component.css` | Grid de 3 columnas | 🗑️ No referenciado |

### Estilos globales (styles.css)

- Sistema de diseño dark theme con variables CSS personalizadas
- Fuentes: Outfit + Inter (Google Fonts)
- Fondos oscuros (#0b0f19, #1e293b), acentos violeta (#6366f1, #a855f7)
- Importa Bootstrap 5.3.8 y FontAwesome 6 desde CDN

### Librerías no utilizadas

| Librería | package.json | Uso real |
|----------|-------------|----------|
| **SweetAlert2** | `sweetalert2: ^11.26.24` | ❌ No se importa en ningún componente |
| **AnimeJS** | `animejs: ^4.4.1` | ❌ No se importa en ningún componente |

---

## Frontend — Pendiente / Por Implementar

| Ítem | Detalle |
|------|---------|
| **Autenticación real** | Login/Register sin lógica — falta conectar con backend, manejar sesión/token |
| **Auth Guard** | No hay `canActivate` para proteger rutas |
| **Interceptor HTTP** | No hay interceptor para adjuntar tokens JWT |
| **core/** | No existe directorio core/ (ni guards, interceptors, ni pipes) |
| **Componentes rotos** | `MenuComponent` y `SalaCardComponent` no son standalone — incompatibles con Angular 17 standalone |
| **Archivos huérfanos** | `pages/inicio/` y `pages/salas/` legacy deben limpiarse |
| **Botón "Reservar Sala"** | Visible en SalasComponent pero **no tiene (click) handler** — no redirige a `/reservas/nueva` |
| **Editar/Eliminar reservas** | No implementado (ni en backend ni frontend) |
| **Estudiantes page** | Stub — aunque `EstudianteService` existe y está completo |
| **Manejo de errores global** | Sin notificaciones toast/alert globales (SweetAlert2 está en deps pero no se usa) |
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

## ⚠️ Hallazgos Críticos Detectados

### 1. data.sql — Schema obsoleto e incompatible

El archivo `data.sql` en la raíz del proyecto pertenece a una versión anterior del modelo de datos y **NO es compatible** con las entidades JPA actuales. Diferencias encontradas:

| Tabla/data.sql | Tabla/entity | Columnas data.sql | Columnas entity |
|---------------|--------------|-------------------|-----------------|
| `carrera` | `carrera` | `id, nombre` | `id, nombre_carrera, facultad` |
| `estudiante` | `estudiante` | `id, nombre, email, carrera_id` | `id, rut, nombre, apellido, correo, telefono, fecha_registro, id_carrera` |
| `edificio` | `edificio` | `id, nombre, direccion` | `id, nombre_edificio, direccion` |
| `sala` | `sala` | `id, nombre, capacidad, piso, edificio_id, imagen_url` | `id, codigo_sala, nombre_sala, capacidad, piso, descripcion, estado, id_edificio` |
| `bloque_horario` | `horario_disponible` | `id, hora_inicio, hora_fin, sala_id` | `id, hora_inicio, hora_termino, sala_id` |
| `estado` | `estado_reserva` | `id, nombre` | `id_estado, nombre_estado` |
| `reserva` | `reserva` | `id, fecha, estudiante_id, sala_id, bloque_id, estado_id` | `id, fecha_reserva, observacion, fecha_creacion, estudiante_id, sala_id, horario_disponible_id, estado_reserva_id` |

**Conclusión:** Ejecutar `data.sql` contra la BD actual con `ddl-auto=update` provocará errores de constraint o datos inconsistentes.

### 2. application.yml sin context-path

`application.yml` **no incluye** `server.servlet.context-path=/api`, mientras que `application.properties` sí. Como Spring Boot da prioridad a YAML sobre properties en ciertas configuraciones, el prefijo `/api` puede no aplicarse en producción.

### 3. Componentes shared con referencias legacy

- **MenuComponent** y **SalaCardComponent** fueron convertidos a standalone components (✅ corregido).
- **SalaCardComponent** referencia campos que no existen en el modelo actual (`sala.imagen_url`, `sala.bloques`, `sala.edificio.nombre` debería ser `sala.edificio?.nombreEdificio`). Templates no actualizados al modelo vigente.

### 4. Archivos huérfanos legacy

Los archivos en `src/app/pages/` (`inicio/`, `salas/`) pertenecen a una versión anterior del frontend y no están referenciados por ninguna ruta activa en `app.routes.ts`. Deberían eliminarse para evitar confusión.

### 5. SweetAlert2 y AnimeJS no utilizados

Ambos están declarados en `package.json` como dependencias pero **ninguno se importa** en ningún componente del frontend.

---

## Notas Técnicas

- **BD:** PostgreSQL, base `demo01`, schema auto-generado por Hibernate (`ddl-auto=update`)
- **Puerto backend:** `6789` (vía variable `PORT`)
- **Proxy frontend dev:** `ng serve` → proxy `/api` → `localhost:6789`
- **Context-path:** Definido en `application.properties` como `/api` pero el `application.yml` **no lo incluye** (⚠️ riesgo)
- **CORS:** Configurado dinámicamente vía `CORS_ALLOWED_ORIGINS` env var
- **Arquitectura actual:** Controladores inyectan repositorios directamente, excepto `ReservaController` que usa `ReservaService`
- **EstadoReservaEntity:** PK manual (`id_estado`), sin `@GeneratedValue` — es tabla lookup
- **Lombok:** Usa `@Data`, `@AllArgsConstructor`, `@NoArgsConstructor` en todas las entidades y DTOs
- **Dockerfile:** Build multi-stage (Maven 3.9.6 + Temurin 17) para despliegue en Render, con `-Dserver.port=${PORT}`
- **Frontend standalone:** Sin NgModules, `bootstrapApplication` en `main.ts`, lazy loading con `loadComponent()`
- **Git:** Rama `main`, 10 commits, `origin/main` sincronizado, working tree limpio

---

## Análisis de Brechas vs. Estado Deseable

| Aspecto | Estado Actual | Brecha |
|---------|--------------|--------|
| Backend services | 1/7 (solo ReservaService) | ❌ Faltan 6 services |
| Backend CRUD | Solo GET/POST parcial | ❌ Sin PUT/PATCH/DELETE |
| Autenticación | No existe | ❌ Crítico |
| Seed data | No existe (data.sql obsoleto) | ❌ |
| Tests | 0% | ❌ |
| SweetAlert2/AnimeJS | Instalados, no usados | ⚠️ |
| Componentes rotos | 2 shared no-standalone | ⚠️ |
| Frontend features completas | 4/7 componentes funcionales | ⚠️ |
| Archivos legacy | 4 archivos huérfanos | ⚠️ |
