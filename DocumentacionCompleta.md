# Documentación Completa del Sistema de Reserva de Salas

**Proyecto:** S2_ATW — ICIFG003-SOL2-EQUIPO08  
**Tecnologías:** Spring Boot 2.5.9 (Backend) + Angular 17.3 (Frontend) + PostgreSQL  
**Repositorio:** `https://github.com/ICIFG003-SOL2-EQUIPO08`

---

## 1. Arquitectura General del Proyecto

```
┌──────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Angular 17)                     │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌───────────────┐   │
│  │   Páginas │  │ Servicios│  │ Componentes│  │  Modelos/DTOs │   │
│  │ (lazy)    │  │  HTTP    │  │ Compartidos│  │  TypeScript   │   │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘  └───────┬───────┘   │
│       └──────────────┴──────────────┴─────────────────┘          │
│                          │ HTTP (proxy /api)                     │
│                   ┌──────┴──────┐                                │
│                   │ localhost:4200│                               │
│                   └─────────────┘                                │
└──────────────────────────────────┬───────────────────────────────┘
                                   │
                        ┌──────────▼──────────┐
                        │  proxy.conf.json    │
                        │  /api → :6789       │
                        └──────────┬──────────┘
                                   │
┌──────────────────────────────────▼───────────────────────────────┐
│                       BACKEND (Spring Boot 2.5.9)                │
│  ┌────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ Controllers│ │ Services │ │Repositori│ │    Entities       │  │
│  │  (REST)    │ │ (1 impl) │ │ (JPA)    │ │  (JPA/Hibernate)  │  │
│  └─────┬──────┘ └────┬─────┘ └────┬─────┘ └───────┬──────────┘  │
│        └──────────────┴────────────┴────────────────┘            │
│                          │ :6789/api/*                           │
│                   ┌──────┴──────┐                                │
│                   │ PostgreSQL  │                                │
│                   │  demo01     │                                │
│                   └─────────────┘                                │
└──────────────────────────────────────────────────────────────────┘
```

### 1.1 Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | Angular (Standalone Components) | 17.3 |
| Frontend | Bootstrap (solo estilos) | 5.3.8 |
| Frontend | SweetAlert2, AnimeJS | declarados, no usados |
| Backend | Spring Boot | 2.5.9 |
| Backend | Java | 17 (Temurin) |
| Backend | Maven | 3.9.12 (wrapper) |
| Backend | Hibernate / Spring Data JPA | — |
| Backend | Lombok | 1.18.36 |
| Backend | Hibernate Validator | — |
| Base de Datos | PostgreSQL | — |
| Contenedor | Docker (multi-stage) | — |
| Hosting | Render.com | — |

### 1.2 Estructura de Carpetas

```
ICIFG003-SOL2-EQUIPO08/
├── Backend/
│   ├── pom.xml
│   ├── Dockerfile
│   ├── .mvn/wrapper/
│   └── src/main/java/com/example/demo/
│       ├── Test01Application.java
│       ├── config/
│       │   ├── CorsConfig.java          (vacío)
│       │   └── WebConfig.java           (CORS dinámico)
│       ├── controller/                  (5 controladores)
│       ├── dto/                         (8 DTOs)
│       ├── entity/                      (7 entidades JPA)
│       ├── repository/                  (7 repositorios)
│       └── service/
│           └── ReservaService.java      (único service)
├── Frontend/
│   ├── angular.json
│   ├── package.json
│   ├── proxy.conf.json
│   └── src/app/
│       ├── app.component.*
│       ├── app.config.ts
│       ├── app.routes.ts
│       ├── models.ts
│       ├── features/
│       │   ├── auth/pages/
│       │   ├── estudiantes/pages/
│       │   ├── reservas/pages/
│       │   └── salas/pages/
│       ├── services/                    (4 servicios HTTP)
│       └── shared/components/
│           ├── mensaje/
│           ├── menu/
│           └── sala-card/
├── data.sql                            (seed, incompatible con entidades actuales)
└── DocumentaciónV1.md                  (documentación previa desactualizada)
```

---

## 2. Modelo de Datos

### 2.1 Diagrama de Entidades y Relaciones

```
┌───────────────┐     ┌──────────────────┐
│   Carrera     │     │    Edificio      │
│───────────────│     │──────────────────│
│ id (PK)       │     │ id (PK)          │
│ nombreCarrera │     │ nombreEdificio   │
│ facultad      │     │ direccion        │
└───────┬───────┘     └────────┬─────────┘
        │                      │
        │ 1:N                  │ 1:N
        ▼                      ▼
┌──────────────────┐     ┌──────────────────┐
│   Estudiante     │     │      Sala        │
│──────────────────│     │──────────────────│
│ id (PK)          │     │ id (PK)          │
│ rut (UK)         │     │ codigoSala (UK)  │
│ nombre           │     │ nombreSala       │
│ apellido         │     │ capacidad        │
│ correo (UK)      │     │ piso             │
│ telefono         │     │ descripcion      │
│ fechaRegistro    │     │ estado           │
│ id_carrera (FK)──┼──┐  │ id_edificio (FK) │
└────────┬─────────┘  │  └────────┬─────────┘
         │            │           │
         │ 1:N        │           │ 1:N
         ▼            │           ▼
┌──────────────────┐  │  ┌──────────────────────┐
│     Reserva      │  │  │ HorarioDisponible     │
│──────────────────│  │  │──────────────────────│
│ id (PK)          │  │  │ id (PK)              │
│ fechaReserva     │  │  │ horaInicio           │
│ observacion      │  │  │ horaTermino          │
│ fechaCreacion    │  │  │ sala_id (FK) ────────┘
│ estudiante_id ───┼──┘  └──────────────────────┘
│ sala_id ─────────┼─────┘
│ horario_id ──────┼─────┘
│ estado_id ───────┼──┐
└──────────────────┘  │
                      │
                 ┌────┴──────────┐
                 │ EstadoReserva │
                 │───────────────│
                 │ id_estado (PK)│
                 │ nombreEstado  │
                 └───────────────┘
```

### 2.2 Entidades

#### `CarreraEntity` — Tabla `carrera`

| Atributo | Tipo | BD | Restricciones |
|----------|------|----|---------------|
| `id` | `Long` | `id` (PK) | `@GeneratedValue(IDENTITY)` |
| `nombreCarrera` | `String` | `nombre_carrera` | `@NotNull`, length=100 |
| `facultad` | `String` | `facultad` | `@NotNull`, length=100 |

```java
@Entity
@Table(name = "carrera")
@Data @AllArgsConstructor @NoArgsConstructor
public class CarreraEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull @Column(name = "nombre_carrera", length = 100, nullable = false)
    private String nombreCarrera;
    @NotNull @Column(length = 100, nullable = false)
    private String facultad;
}
```

#### `EdificioEntity` — Tabla `edificio`

| Atributo | Tipo | BD | Restricciones |
|----------|------|----|---------------|
| `id` | `Long` | `id` (PK) | `@GeneratedValue(IDENTITY)` |
| `nombreEdificio` | `String` | `nombre_edificio` | `@NotNull`, length=100 |
| `direccion` | `String` | `direccion` | `@NotNull`, length=200 |

#### `EstadoReservaEntity` — Tabla `estado_reserva`

| Atributo | Tipo | BD | Restricciones |
|----------|------|----|---------------|
| `idEstado` | `Long` | `id_estado` (PK) | `@Id` manual (sin IDENTITY) |
| `nombreEstado` | `String` | `nombre_estado` | — |

> **Nota:** Usa asignación manual de PK (`@Id` sin `@GeneratedValue`), a diferencia de las demás entidades que usan `IDENTITY`.

#### `EstudianteEntity` — Tabla `estudiante`

| Atributo | Tipo | BD | Restricciones |
|----------|------|----|---------------|
| `id` | `Long` | `id` (PK) | `@GeneratedValue(IDENTITY)` |
| `rut` | `String` | `rut` | `@Pattern("^[0-9]+-[0-9kK]{1}$")`, `unique = true`, length=12 |
| `nombre` | `String` | `nombre` | `@NotNull`, length=100 |
| `apellido` | `String` | `apellido` | `@NotNull`, length=100 |
| `correo` | `String` | `correo` | `@Email`, `unique = true`, length=150 |
| `telefono` | `String` | `telefono` | length=20 |
| `fechaRegistro` | `LocalDateTime` | `fecha_registro` | `@CreationTimestamp`, `updatable = false` |
| `carrera` | `CarreraEntity` | `id_carrera` (FK) | `@ManyToOne` |

**Validaciones:** RUT con formato `^[0-9]+-[0-9kK]{1}$`, email válido, unique en rut y correo.

#### `SalaEntity` — Tabla `sala`

| Atributo | Tipo | BD | Restricciones |
|----------|------|----|---------------|
| `id` | `Long` | `id` (PK) | `@GeneratedValue(IDENTITY)` |
| `codigoSala` | `String` | `codigo_sala` | `unique = true`, length=20 |
| `nombreSala` | `String` | `nombre_sala` | `@NotNull`, length=100 |
| `capacidad` | `Integer` | `capacidad` | `@NotNull` |
| `piso` | `Integer` | `piso` | `@NotNull` |
| `descripcion` | `String` | `descripcion` | `@NotNull`, length=255 |
| `estado` | `String` | `estado` | `@NotNull`, length=30 |
| `edificio` | `EdificioEntity` | `id_edificio` (FK) | `@ManyToOne` |

#### `HorarioDisponibleEntity` — Tabla `horario_disponible`

| Atributo | Tipo | BD | Restricciones |
|----------|------|----|---------------|
| `id` | `Long` | `id` (PK) | `@GeneratedValue(IDENTITY)` |
| `horaInicio` | `LocalTime` | `hora_inicio` | — |
| `horaTermino` | `LocalTime` | `hora_termino` | — |
| `sala` | `SalaEntity` | `sala_id` (FK) | `@ManyToOne` |

#### `ReservaEntity` — Tabla `reserva`

| Atributo | Tipo | BD | Restricciones |
|----------|------|----|---------------|
| `id` | `Long` | `id` (PK) | `@GeneratedValue(IDENTITY)` |
| `fechaReserva` | `LocalDate` | `fecha_reserva` | — |
| `observacion` | `String` | `observacion` | `columnDefinition = "TEXT"` |
| `fechaCreacion` | `LocalDateTime` | `fecha_creacion` | `@CreationTimestamp`, `updatable = false` |
| `estudiante` | `EstudianteEntity` | `estudiante_id` (FK) | `@ManyToOne` |
| `sala` | `SalaEntity` | `sala_id` (FK) | `@ManyToOne` |
| `horarioDisponible` | `HorarioDisponibleEntity` | `horario_disponible_id` (FK) | `@ManyToOne` |
| `estadoReserva` | `EstadoReservaEntity` | `estado_reserva_id` (FK) | `@ManyToOne` |

---

## 3. Repositorios

### `CarreraRepository`
```java
public interface CarreraRepository extends JpaRepository<CarreraEntity, Long> {}
```
Sin queries personalizadas. Usa los métodos estándar de `JpaRepository`.

### `EdificioRepository`
```java
public interface EdificioRepository extends JpaRepository<EdificioEntity, Long> {}
```
Sin queries personalizadas.

### `EstadoReservaRepository`
```java
public interface EstadoReservaRepository extends JpaRepository<EstadoReservaEntity, Long> {}
```
Sin queries personalizadas.

### `EstudianteRepository`
```java
@Query("SELECT e FROM EstudianteEntity e WHERE e.rut = :rut OR (e.nombre = :nombre AND e.apellido = :apellido)")
List<EstudianteEntity> findByRutOrNombreAndApellido(@Param("rut") String rut,
                                                     @Param("nombre") String nombre,
                                                     @Param("apellido") String apellido);
```
**Propósito:** Buscar estudiantes por RUT exacto O por combinación nombre+apellido. Usa JPQL con `OR` lógico. Los parámetros pueden ser `null` desde el controlador (cuando no se envían en la query).

### `HorarioDisponibleRepository`
```java
@Query("SELECT h FROM HorarioDisponibleEntity h " +
       "WHERE h.sala.id = :salaId " +
       "ORDER BY h.horaInicio")
List<HorarioDisponibleEntity> findBySalaOrderByHoraInicio(@Param("salaId") Long salaId);
```
**Propósito:** Obtener todos los horarios disponibles de una sala, ordenados por hora de inicio ascendente.

### `ReservaRepository`
```java
@Query(value = "SELECT * FROM reserva WHERE sala_id = :salaId AND fecha_reserva = :fecha",
       nativeQuery = true)
List<ReservaEntity> findBySalaAndFecha(@Param("salaId") Long salaId,
                                       @Param("fecha") LocalDate fecha);

@Query("SELECT r FROM ReservaEntity r " +
       "WHERE r.sala.id = :salaId " +
       "AND r.horarioDisponible.id = :horarioId " +
       "AND r.fechaReserva = :fecha " +
       "AND r.estadoReserva.nombreEstado <> :estadoExcluido")
List<ReservaEntity> findConflictoHorario(@Param("salaId") Long salaId,
                                          @Param("horarioId") Long horarioId,
                                          @Param("fecha") LocalDate fecha,
                                          @Param("estadoExcluido") String estadoExcluido);
```
- **`findBySalaAndFecha`:** Consulta nativa SQL que obtiene reservas por sala y fecha. Usada en el servicio para el filtro de consulta.
- **`findConflictoHorario`:** Consulta JPQL que detecta conflictos de horario. Excluye reservas con estado "Cancelada" para permitir re-reservar un slot cancelado.

### `SalaRepository`
```java
@Query(value = "SELECT * FROM sala s WHERE s.capacidad = :capacidad AND s.id_edificio = :edificioId",
       nativeQuery = true)
List<SalaEntity> findByCapacidadAndEdificioNative(@Param("capacidad") Integer capacidad,
                                                   @Param("edificioId") Long edificioId);

@Query("SELECT s FROM SalaEntity s JOIN FETCH s.edificio")
List<SalaEntity> findAllWithEdificio();
```
- **`findByCapacidadAndEdificioNative`:** Filtro combinado por capacidad y edificio. Nativa porque usa nombres de columna físicos.
- **`findAllWithEdificio`:** JPQL con `JOIN FETCH` para evitar N+1 queries al cargar todas las salas con su edificio asociado en una sola consulta.

---

## 4. Servicios — `ReservaService`

### `obtenerReservas(Long salaId, LocalDate fecha)`

**Parámetros:** Ambos opcionales.  
**Lógica:**
- Si `salaId` y `fecha` están presentes → usa `reservaRepository.findBySalaAndFecha(salaId, fecha)`
- Si no → usa `reservaRepository.findAll()`
- Convierte cada `ReservaEntity` a `ReservaResponseDTO` con toda la información anidada (estudiante, sala, horario, estado)

### `crearReserva(ReservaRequestDTO request)` — `@Transactional`

Flujo de validaciones (en orden):

```
1. Validar fecha obligatoria
   ├── request.getFechaReserva() == null → RuntimeException
   |
2. Validar fecha no anterior a hoy
   ├── request.getFechaReserva().isBefore(LocalDate.now()) → RuntimeException
   |
3. Validar observación ≥ 15 caracteres (trim)
   ├── request.getObservacion().trim().length() < 15 → RuntimeException
   |
4. Validar existencia de Estudiante
   ├── estudianteRepository.findById(id) → orElseThrow("El estudiante con ID X no existe")
   |
5. Validar existencia de Sala
   ├── salaRepository.findById(id) → orElseThrow("La sala con ID X no existe")
   |
6. Validar existencia de HorarioDisponible
   ├── horarioDisponibleRepository.findById(id) → orElseThrow("El horario disponible...")
   |
7. Validar existencia de EstadoReserva
   ├── estadoReservaRepository.findById(id) → orElseThrow("El estado de reserva...")
   |
8. Validar conflicto horario
   ├── findConflictoHorario(salaId, horarioId, fecha, "Cancelada")
   ├── !conflictos.isEmpty() → RuntimeException
   |
9. Crear y guardar entidad
   ├── entity.setFechaReserva(trimmed)
   ├── entity.setObservacion(trimmed)
   ├── entity.setEstudiante(estudiante)
   ├── entity.setSala(sala)
   ├── entity.setHorarioDisponible(horario)
   ├── entity.setEstadoReserva(estado)
   ├── reservaRepository.save(entity)
   └── return convertToDTO(saved)
```

**Código:**
```java
@Transactional
public ReservaResponseDTO crearReserva(ReservaRequestDTO request) {
    if (request.getFechaReserva() == null) {
        throw new RuntimeException("La fecha de reserva es obligatoria");
    }
    if (request.getFechaReserva().isBefore(LocalDate.now())) {
        throw new RuntimeException("La fecha de reserva no puede ser anterior a hoy");
    }
    if (request.getObservacion() == null || request.getObservacion().trim().length() < 15) {
        throw new RuntimeException("La observacion debe tener al menos 15 caracteres");
    }

    EstudianteEntity estudiante = estudianteRepository.findById(request.getEstudianteId())
        .orElseThrow(() -> new RuntimeException("El estudiante con ID " + request.getEstudianteId() + " no existe"));
    SalaEntity sala = salaRepository.findById(request.getSalaId())
        .orElseThrow(() -> new RuntimeException("La sala con ID " + request.getSalaId() + " no existe"));
    HorarioDisponibleEntity horario = horarioDisponibleRepository.findById(request.getHorarioDisponibleId())
        .orElseThrow(() -> new RuntimeException("El horario disponible con ID " + request.getHorarioDisponibleId() + " no existe"));
    EstadoReservaEntity estado = estadoReservaRepository.findById(request.getEstadoReservaId())
        .orElseThrow(() -> new RuntimeException("El estado de reserva con ID " + request.getEstadoReservaId() + " no existe"));

    List<ReservaEntity> conflictos = reservaRepository.findConflictoHorario(
        request.getSalaId(), request.getHorarioDisponibleId(),
        request.getFechaReserva(), "Cancelada");
    if (!conflictos.isEmpty()) {
        throw new RuntimeException("Ya existe una reserva activa para esta sala, horario y fecha");
    }

    ReservaEntity entity = new ReservaEntity();
    entity.setFechaReserva(request.getFechaReserva());
    entity.setObservacion(request.getObservacion().trim());
    entity.setEstudiante(estudiante);
    entity.setSala(sala);
    entity.setHorarioDisponible(horario);
    entity.setEstadoReserva(estado);

    ReservaEntity saved = reservaRepository.save(entity);
    return convertToDTO(saved);
}
```

---

## 5. Controladores

### `EstadoReservaController`

| Método | Ruta | Parámetros | Respuesta |
|--------|------|------------|-----------|
| `GET` | `/api/estados-reserva` | — | `List<EstadoReservaResponseDTO>` |

**Ejemplo respuesta:**
```json
[
  { "id": 1, "nombreEstado": "Confirmada" },
  { "id": 2, "nombreEstado": "Cancelada" }
]
```

### `EstudianteController`

| Método | Ruta | Parámetros | Respuesta |
|--------|------|------------|-----------|
| `GET` | `/api/estudiantes/buscar` | `rut` (opcional), `nombre` (opcional), `apellido` (opcional) | `List<EstudianteResponseDTO>` |

**Ejemplo:** `GET /api/estudiantes/buscar?rut=12345678-5`  
**Ejemplo:** `GET /api/estudiantes/buscar?nombre=Juan&apellido=Perez`

### `HorarioDisponibleController`

| Método | Ruta | Parámetros | Respuesta |
|--------|------|------------|-----------|
| `GET` | `/api/horarios` | `salaId` (requerido) | `List<HorarioDisponibleResponseDTO>` |

**Ejemplo:** `GET /api/horarios?salaId=1`

### `SalaController`

| Método | Ruta | Parámetros | Respuesta |
|--------|------|------------|-----------|
| `GET` | `/api/salas` | `capacidad` (opcional), `edificioId` (opcional) | `List<SalaResponseDTO>` |

**Lógica de filtro:**
- Si `capacidad` y `edificioId` están presentes → `findByCapacidadAndEdificioNative`
- Si no → `findAllWithEdificio` (JOIN FETCH)

### `ReservaController`

| Método | Ruta | Parámetros | Respuesta |
|--------|------|------------|-----------|
| `GET` | `/api/reservas` | `salaId` (opcional), `fecha` (opcional, formato `YYYY-MM-DD`) | `List<ReservaResponseDTO>` |
| `POST` | `/api/reservas` | Body: `ReservaRequestDTO` | `ReservaResponseDTO` |

**Ejemplo POST:**
```json
{
  "fechaReserva": "2026-06-15",
  "observacion": "Reunión de proyecto final - equipo de desarrollo",
  "estudianteId": 1,
  "salaId": 2,
  "horarioDisponibleId": 3,
  "estadoReservaId": 1
}
```

---

## 6. Frontend — Estructura

### 6.1 Rutas

Definidas en `app.routes.ts` con lazy loading:

| Ruta | Componente | Carga |
|------|-----------|-------|
| `""` | redirige a `/login` | — |
| `"/login"` | `LoginComponent` | `loadComponent()` |
| `"/register"` | `RegisterComponent` | `loadComponent()` |
| `"/salas"` | `SalasComponent` | `loadComponent()` |
| `"/reservas/nueva"` | `ReservaFormComponent` | `loadComponent()` |
| `"/reservas"` | `ReservasComponent` | `loadComponent()` |
| `"/estudiantes"` | `EstudiantesComponent` | `loadComponent()` |
| `"**"` | redirige a `/login` | — |

```typescript
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/pages/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/pages/register.component').then(m => m.RegisterComponent) },
  { path: 'salas', loadComponent: () => import('./features/salas/pages/salas.component').then(m => m.SalasComponent) },
  { path: 'reservas/nueva', loadComponent: () => import('./features/reservas/pages/reserva-form.component').then(m => m.ReservaFormComponent) },
  { path: 'reservas', loadComponent: () => import('./features/reservas/pages/reservas.component').then(m => m.ReservasComponent) },
  { path: 'estudiantes', loadComponent: () => import('./features/estudiantes/pages/estudiantes.component').then(m => m.EstudiantesComponent) },
  { path: '**', redirectTo: 'login' }
];
```

### 6.2 Servicios HTTP

Todos los servicios son standalone (`providedIn: 'root'`) y usan `HttpClient` con `HttpParams`:

| Servicio | Ruta Base | Métodos |
|----------|-----------|---------|
| `SalaService` | `/api/salas` | `getSalas(capacidad?, edificioId?)` |
| `HorarioService` | `/api/horarios` | `getHorarios(salaId)` |
| `ReservaService` | `/api/reservas` | `getReservas(salaId?, fecha?)`, `crearReserva(dto)` |
| `EstudianteService` | `/api/estudiantes/buscar` | `buscarEstudiante({rut?, nombre?, apellido?})` |

### 6.3 Modelos TypeScript (`models.ts`)

```typescript
export interface CarreraResponseDTO {
  id: number;
  nombreCarrera: string;
  facultad: string;
}
export interface EdificioResponseDTO {
  id: number;
  nombreEdificio: string;
  direccion: string;
}
export interface EstadoReservaResponseDTO {
  id: number;
  nombreEstado: string;
}
export interface HorarioDisponibleResponseDTO {
  id: number;
  horaInicio: string;   // "HH:mm:ss"
  horaTermino: string;  // "HH:mm:ss"
}
export interface EstudianteResponseDTO {
  id: number;
  rut: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  fechaRegistro: string;
  carrera?: CarreraResponseDTO;
}
export interface SalaResponseDTO {
  id: number;
  codigoSala: string;
  nombreSala: string;
  capacidad: number;
  piso: number;
  descripcion: string;
  estado: string;
  edificio?: EdificioResponseDTO;
}
export interface ReservaRequestDTO {
  fechaReserva: string;      // "YYYY-MM-DD"
  observacion: string;
  estudianteId: number;
  salaId: number;
  horarioDisponibleId: number;
  estadoReservaId: number;
}
export interface ReservaResponseDTO {
  id: number;
  fechaReserva: string;
  observacion: string;
  fechaCreacion: string;
  estudiante?: EstudianteResponseDTO;
  sala?: SalaResponseDTO;
  horarioDisponible?: HorarioDisponibleResponseDTO;
  estadoReserva?: EstadoReservaResponseDTO;
}
```

---

## 7. Componentes Compartidos

### `MensajeComponent`

Componente de alerta reutilizable con tres variantes visuales.

**Inputs:**
- `tipo`: `'exito' | 'error' | 'advertencia'` (default `'error'`)
- `texto`: `string`

**Template:**
```html
<div *ngIf="texto" class="mensaje"
     [class.mensaje-exito]="tipo === 'exito'"
     [class.mensaje-error]="tipo === 'error'"
     [class.mensaje-advertencia]="tipo === 'advertencia'"
     role="alert" aria-live="polite">
  <i class="fas {{ icono }}"></i>
  <span>{{ texto }}</span>
</div>
```

**Iconos:**
- `exito` → `fa-check-circle`
- `error` → `fa-exclamation-triangle`
- `advertencia` → `fa-exclamation-circle`

### `MenuComponent`

Barra de navegación secundaria con tres enlaces:
```typescript
links = [
  { label: 'Inicio', path: '/' },
  { label: 'Salas', path: '/salas' },
  { label: 'Mis Reservas', path: '/reservas' }
];
```

### `SalaCardComponent`

Tarjeta visual para mostrar información de una sala.

**Inputs:**
- `sala: any` — objeto con propiedades `imagen_url`, `nombre`, `capacidad`, `piso`, `edificio`, `bloques`

**Template (referencia a campos legacy — no coincide con `SalaResponseDTO` actual):**
```html
<article class="card" tabindex="0" aria-label="Información de sala">
  <img [src]="sala.imagen_url" [alt]="'Imagen de ' + sala.nombre">
  <h3>{{ sala.nombre }}</h3>
  <p>Capacidad: {{ sala.capacidad }}</p>
  <p>Piso: {{ sala.piso }}</p>
  <p>Edificio: {{ sala.edificio.nombre }}</p>
  <section>
    <h4>Horarios disponibles:</h4>
    <ul>
      <li *ngFor="let bloque of sala.bloques">
        {{ bloque.hora_inicio }} - {{ bloque.hora_fin }}
      </li>
    </ul>
  </section>
  <button (click)="reservar()" aria-label="Reservar sala">Reservar</button>
</article>
```

> **Nota:** Este componente referencia campos (`imagen_url`, `bloques`, `hora_inicio`, `hora_fin`) que ya no existen en el modelo de datos actual. Está pensado para la versión legacy y no se usa en las rutas activas.

---

## 8. Formulario de Reserva — Flujo Completo

### 8.1 Estructura del Formulario Reactivo

El componente `ReservaFormComponent` usa un `FormGroup` con 5 campos:

```typescript
this.reservaForm = this.fb.group({
  estudianteSearch: [''],                          // búsqueda textual
  fechaReserva: ['', [Validators.required, fechaNoAnteriorAHoy]],
  salaId: ['', Validators.required],
  horarioDisponibleId: ['', Validators.required],
  observacion: ['', [Validators.required, Validators.minLength(15)]]
});
```

### 8.2 Pasos del Formulario

#### Paso 1 — Buscar y Seleccionar Estudiante
- Input de texto libre
- Si el texto coincide con patrón de RUT (`^[0-9]+-[0-9kK]{1}$`) → busca por RUT
- Si no → asume "nombre apellido" (primer espacio separa nombre de apellido)
- Muestra resultados en lista con `role="listbox"` y navegación por teclado
- Al seleccionar, se muestra avatar con iniciales y datos del estudiante
- Botón "×" para quitar selección

#### Paso 2 — Seleccionar Fecha
- Input `<input type="date">`
- **Validación personalizada `fechaNoAnteriorAHoy`:**
```typescript
function fechaNoAnteriorAHoy(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fecha = new Date(control.value + 'T00:00:00');
  return fecha >= hoy ? null : { fechaAnterior: true };
}
```

#### Paso 3 — Seleccionar Sala
- `<select>` con opciones cargadas desde `SalaService.getSalas()`
- Al cambiar, dispara `onSalaChange()` que resetea horario y carga los horarios disponibles

#### Paso 4 — Seleccionar Horario
- Botones con `role="radio"` mostrando `horaInicio` → `horaTermino`
- Solo visible después de seleccionar sala
- Indicador de carga mientras se obtienen horarios

#### Paso 5 — Observaciones
- `<textarea>` con contador de caracteres en vivo (`{{ length }}/15`)
- Validación: requerido y mínimo 15 caracteres

#### Paso 6 — Envío
- Botón "Reservar Sala" con estado deshabilitado mientras se envía
- Manejo de error específico: si el mensaje contiene "conflicto" o "ya existe", muestra mensaje amigable
- En caso de éxito, redirige a `/reservas`

### 8.3 Accesibilidad

El formulario implementa:
- `aria-labelledby` en cada sección del formulario
- `role="alert"` en mensajes de error
- `aria-live="polite"` en contenido dinámico
- `role="listbox"` / `role="option"` en resultados de búsqueda
- `aria-checked` en botones de horario
- `aria-describedby` para hints
- `tabindex` explícito para orden de navegación
- `role="status"` para indicadores de carga
- Etiquetas `<label>` asociadas a cada input

---

## 9. Configuración

### 9.1 Backend — `application.properties`

```properties
spring.application.name=back
server.port=${PORT:6789}
spring.datasource.url=jdbc:postgresql://localhost:5432/demo01
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=1234
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation=true
server.servlet.context-path=/api
```

| Propiedad | Valor | Nota |
|-----------|-------|------|
| Puerto | `${PORT:6789}` | Usa variable de entorno PORT, default 6789 |
| Conexión PostgreSQL | `localhost:5432/demo01` | Usuario: `${DB_USERNAME:postgres}`, Pass: `1234` |
| DDL | `update` | Hibernate crea/actualiza tablas automáticamente |
| Context path | `/api` | Todos los endpoints bajo `/api/*` |

### 9.2 Backend — CORS (`WebConfig.java`)

```java
@Value("${CORS_ALLOWED_ORIGINS:http://localhost:4200,http://localhost:4201,https://icifg003-eq08.onrender.com}")
private String[] allowedOrigins;

@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
            .allowedOriginPatterns(allowedOrigins)
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
}
```

Orígenes permitidos por defecto:
- `http://localhost:4200` (Angular dev)
- `http://localhost:4201` (Angular dev alternativo)
- `https://icifg003-eq08.onrender.com` (producción en Render)

### 9.3 Frontend — Proxy (`proxy.conf.json`)

```json
{
  "/api": {
    "target": "http://localhost:6789",
    "secure": false,
    "logLevel": "debug"
  }
}
```

Redirige todas las peticiones `/api/*` al backend en puerto 6789 durante desarrollo.

### 9.4 Dockerfile

Multi-stage build:
- **Build stage:** `maven:3.9.6-eclipse-temurin-17` → `mvn clean package -DskipTests`
- **Runtime stage:** `eclipse-temurin:17-jre-jammy` → `java -Dserver.port=${PORT} -Xmx512m -jar app.jar`

---

## 10. Flujo Completo de una Reserva (Punta a Punta)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    FLUJO COMPLETO DE RESERVA                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  USUARIO                     FRONTEND                      BACKEND     │
│  ───────                     ────────                      ──────      │
│                                                                         │
│    │                            │                            │          │
│    ├── 1. Navega a /salas ──────┤                            │          │
│    │                            │                            │          │
│    │                            ├── 2. GET /api/salas ───────┤          │
│    │                            │                            │          │
│    │                            │    ← List<SalaResponseDTO> │          │
│    │◄──── 3. Ve lista ─────────┤                            │          │
│    │     de salas              │                            │          │
│    │                            │                            │          │
│    ├── 4. Hace clic             │                            │          │
│    │    "Reservar Sala" ────────┤                            │          │
│    │                            │                            │          │
│    │     Navega a /reservas/nueva                             │          │
│    │                            │                            │          │
│    ├── 5. Busca estudiante ─────┤                            │          │
│    │   (RUT: 12345678-5)       ├── 6. GET /api/estudiantes/  │          │
│    │                            │        buscar?rut=... ─────┤          │
│    │                            │                            │          │
│    │                            │         ← EstudianteDTO    │          │
│    │◄──── 7. Selecciona ───────┤                            │          │
│    │    estudiante             │                            │          │
│    │                            │                            │          │
│    ├── 8. Elige fecha ─────────┤                            │          │
│    │   (2026-06-15)            │                            │          │
│    │                            │                            │          │
│    ├── 9. Elige sala ──────────┤                            │          │
│    │                            ├── 10. GET /api/horarios?   │          │
│    │                            │         salaId=2 ─────────┤          │
│    │                            │                            │          │
│    │                            │     ← HorariosDisponibles │          │
│    │◄──── 11. Ve horarios ─────┤                            │          │
│    │                            │                            │          │
│    ├── 12. Elige horario ──────┤                            │          │
│    │    10:30 - 12:30          │                            │          │
│    │                            │                            │          │
│    ├── 13. Escribe observación ─┤                            │          │
│    │   (≥15 caracteres)        │                            │          │
│    │                            │                            │          │
│    ├── 14. Hace clic            │                            │          │
│    │    "Reservar Sala" ────────┤                            │          │
│    │                            │                            │          │
│    │                            ├── 15. POST /api/reservas ──┤          │
│    │                            │     {fechaReserva,         │          │
│    │                            │      observacion,          │          │
│    │                            │      estudianteId:1,       │          │
│    │                            │      salaId:2,             │          │
│    │                            │      horarioDisponibleId:3,│          │
│    │                            │      estadoReservaId:1}    │          │
│    │                            │                            │          │
│    │                            │                            ├── VALIDA │
│    │                            │                            │  ────────│
│    │                            │                            │ ✓ ¿fecha │
│    │                            │                            │   no null?│
│    │                            │                            │ ✓ ¿fecha │
│    │                            │                            │   >= hoy? │
│    │                            │                            │ ✓ ¿obs ≥ │
│    │                            │                            │   15 chars│
│    │                            │                            │ ✓ ¿existe │
│    │                            │                            │   estudiante?│
│    │                            │                            │ ✓ ¿existe │
│    │                            │                            │   sala?   │
│    │                            │                            │ ✓ ¿existe │
│    │                            │                            │   horario?│
│    │                            │                            │ ✓ ¿existe │
│    │                            │                            │   estado? │
│    │                            │                            │ ✓ ¿no hay │
│    │                            │                            │   conflicto│
│    │                            │                            │   (excluye │
│    │                            │                            │   Cancelada)?│
│    │                            │                            │          │
│    │                            │                            ├── GUARDA │
│    │                            │                            │ INSERT en│
│    │                            │                            │ reserva  │
│    │                            │                            │          │
│    │                            │    ← ReservaResponseDTO    │          │
│    │                            │                            │          │
│    │       Redirige a /reservas │                            │          │
│    │                            │                            │          │
│    ├── 16. Ve reserva creada ───┤                            │          │
│    │   en el panel             │                            │          │
│    │                            │                            │          │
│    │                            ├── 17. GET /api/reservas?   │          │
│    │                            │     salaId=2&fecha=...    │          │
│    │                            │                            │          │
│    │                            │    ← List<ReservaResponse> │          │
│    │◄──── 18. Confirma ────────┤                            │          │
│    │    reserva activa         │                            │          │
│    │                            │                            │          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Resumen de validaciones del backend:

| # | Validación | Código | Mensaje de error |
|---|-----------|--------|------------------|
| 1 | Fecha obligatoria | `request.getFechaReserva() == null` | "La fecha de reserva es obligatoria" |
| 2 | Fecha no anterior a hoy | `isBefore(LocalDate.now())` | "La fecha de reserva no puede ser anterior a hoy" |
| 3 | Observación mínima | `trim().length() < 15` | "La observacion debe tener al menos 15 caracteres" |
| 4 | Estudiante existe | `findById().orElseThrow()` | "El estudiante con ID X no existe" |
| 5 | Sala existe | `findById().orElseThrow()` | "La sala con ID X no existe" |
| 6 | Horario existe | `findById().orElseThrow()` | "El horario disponible con ID X no existe" |
| 7 | Estado existe | `findById().orElseThrow()` | "El estado de reserva con ID X no existe" |
| 8 | Sin conflicto horario | `findConflictoHorario(..., "Cancelada")` | "Ya existe una reserva activa para esta sala, horario y fecha" |

### Formato de DTOs de entrada/salida:

**Request (`ReservaRequestDTO`):**
```json
{
  "fechaReserva": "2026-06-15",
  "observacion": "Reunión de proyecto final - equipo de desarrollo",
  "estudianteId": 1,
  "salaId": 2,
  "horarioDisponibleId": 3,
  "estadoReservaId": 1
}
```

**Response (`ReservaResponseDTO`):**
```json
{
  "id": 16,
  "fechaReserva": "2026-06-15",
  "observacion": "Reunión de proyecto final - equipo de desarrollo",
  "fechaCreacion": "2026-06-09T10:30:00",
  "estudiante": {
    "id": 1,
    "rut": "12345678-5",
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan@correo.com",
    "telefono": null,
    "fechaRegistro": "2026-03-01T00:00:00",
    "carrera": { "id": 1, "nombreCarrera": "Ingeniería Informática", "facultad": "Ingeniería" }
  },
  "sala": {
    "id": 2,
    "codigoSala": "SALA-A2",
    "nombreSala": "Sala A2",
    "capacidad": 15,
    "piso": 1,
    "descripcion": "Sala de estudio con proyector",
    "estado": "Disponible",
    "edificio": { "id": 1, "nombreEdificio": "Edificio Central", "direccion": "Av. Universidad 123" }
  },
  "horarioDisponible": {
    "id": 3,
    "horaInicio": "10:30:00",
    "horaTermino": "12:30:00"
  },
  "estadoReserva": {
    "id": 1,
    "nombreEstado": "Confirmada"
  }
}
```

---

## Notas Técnicas Adicionales

### Problemas Conocidos

1. **`data.sql` incompatible** — Los nombres de tablas y columnas en `data.sql` (bloque_horario, estado, email, etc.) no coinciden con las entidades JPA actuales.
2. **`application.yml`** — Carece de `server.servlet.context-path=/api`, lo que puede sobrescribir la configuración de `application.properties` según el orden de carga.
3. **`CorsConfig.java`** — Archivo vacío, la configuración CORS real está en `WebConfig.java`.
4. **Componentes legacy** — `pages/inicio/` y `pages/salas/` no están referenciados en las rutas.
5. **`SalaCardComponent`** — Referencia campos (`imagen_url`, `bloques`) que no existen en el modelo actual `SalaResponseDTO`.
6. **Auth** — `LoginComponent` y `RegisterComponent` tienen solo UI, sin lógica de autenticación real.
7. **Tests** — No existen tests unitarios ni de integración.
8. **Dependencias no usadas** — SweetAlert2 y AnimeJS están en `package.json` pero nunca se importan.

### Comandos de Desarrollo

```bash
# Backend
cd Backend
./mvnw spring-boot:run              # Iniciar servidor en :6789
./mvnw clean package -DskipTests    # Build JAR

# Frontend
cd Frontend
npm install                         # Instalar dependencias
ng serve                            # Iniciar servidor en :4200
ng serve --port 4201                # Puerto alternativo

# Docker
cd Backend
docker build -t reservas-backend .  # Build imagen
docker run -p 6789:6789 reservas-backend  # Ejecutar contenedor
```
