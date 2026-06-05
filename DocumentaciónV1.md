# Documentación del Estado del Proyecto — S2_ATW

> **Versión:** 1.0  
> **Fecha:** 03 junio 2026  
> **Propósito:** Documentar el estado actual del proyecto S2_ATW (Sistema de Reserva de Salas).  
> **Nota:** Este documento se actualizará conforme avance el desarrollo.

---

## 1. Descripción General

**S2_ATW** es un sistema de reserva de salas para instituciones educativas. El proyecto se encuentra en fase de construcción: el backend tiene la capa de datos completa (entidades JPA y repositorios), mientras que el frontend Angular 17 acaba de ser reestructurado desde cero. Las capas intermedias (servicios, DTOs y controladores REST) y la interfaz de usuario están pendientes de desarrollo.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| **Backend** | Spring Boot | 2.5.9 |
| | Java | 17 |
| | Maven (Wrapper) | 3.8.1 |
| | PostgreSQL | — |
| | JPA / Hibernate | Spring Data JPA |
| | Lombok | 1.18.36 |
| **Frontend** | Angular (standalone) | 17.3 |
| | TypeScript | 5.4 |
| | Bootstrap | 5.3 |
| | SweetAlert2 | 11.26 |
| | Anime.js | 4.4 |
| | RxJS | 7.8 |
| **Despliegue** | Render | — |

---

## 3. Backend

### 3.1 Estructura de paquetes

```
Backend/src/main/java/com/example/demo/
├── config/
│   ├── CorsConfig.java       → VACÍO
│   └── WebConfig.java        → CORS configurado
├── controller/               → VACÍO (pendiente)
├── dto/                      → VACÍO (pendiente)
├── entity/                   → 7 entidades JPA
├── interfaces/               → VACÍO (pendiente)
├── repository/               → 2 repositorios JPA
├── service/                  → VACÍO (pendiente)
└── Test01Application.java    → Main class
```

### 3.2 Modelo de Datos

Se definen 7 entidades JPA que modelan el dominio de reserva de salas:

| Entidad | Tabla | Atributos Clave | Relaciones |
|---|---|---|---|
| `CarreraEntity` | `carrera` | id (PK), nombreCarrera, facultad | — |
| `EdificioEntity` | `edificio` | id (PK), nombreEdificio, direccion | — |
| `SalaEntity` | `sala` | id (PK), codigoSala (UK), nombreSala, capacidad, piso, descripcion, estado | @ManyToOne → Edificio |
| `HorarioDisponibleEntity` | `horario_disponible` | id (PK), horaInicio (LocalTime), horaTermino (LocalTime) | @ManyToOne → Sala |
| `EstadoReservaEntity` | `estado_reserva` | idEstado (PK manual), nombreEstado | — |
| `EstudianteEntity` | `estudiante` | id (PK), rut (UK), nombre, apellido, correo (UK), telefono, fechaRegistro | @ManyToOne → Carrera |
| `ReservaEntity` | `reserva` | id (PK), fechaReserva (LocalDate), observacion, fechaCreacion | @ManyToOne → Estudiante, Sala, HorarioDisponible, EstadoReserva |

#### Diagrama relacional

```
Carrera 1 ── N Estudiante
Edificio 1 ── N Sala
Sala 1 ── N HorarioDisponible
Sala 1 ── N Reserva
Estudiante 1 ── N Reserva
HorarioDisponible 1 ── N Reserva
EstadoReserva 1 ── N Reserva
```

#### Detalles técnicos

- **PKs**: todas `Long` con `GenerationType.IDENTITY`, excepto `EstadoReservaEntity` que usa asignación manual.
- **Auditoría**: `@CreationTimestamp` en `EstudianteEntity.fechaRegistro` y `ReservaEntity.fechaCreacion` (no actualizables).
- **Validaciones**: RUT chileno con `@Pattern(regexp = "^[0-9]+-[0-9kK]{1}$")`, correo con `@Email`.
- **Uniques**: `rut` y `correo` en Estudiante; `codigoSala` en Sala.
- **Tipos temporales**: `LocalTime` en horarios, `LocalDate` en fecha de reserva.
- **Nombres**: tablas y columnas en español con snake_case vía `@Table` y `@Column`.

### 3.3 Repositorios

| Repositorio | Método | Tipo | Descripción |
|---|---|---|---|
| `ReservaRepository` | `findBySalaAndFecha(salaId, fecha)` | Nativa | `SELECT * FROM reserva WHERE sala_id = ? AND fecha_reserva = ?` |
| `ReservaRepository` | `findConflictoHorario(salaId, horarioId, fecha, estadoExcluido)` | JPQL | Busca reservas activas que choquen con un horario específico |
| `HorarioDisponibleRepository` | `findBySalaOrderByHoraInicio(salaId)` | JPQL | Horarios de una sala ordenados por hora de inicio |

Ambos extienden `JpaRepository<Entity, Long>`.

### 3.4 Configuración del Backend

**WebConfig.java**: CORS habilitado para `localhost:4200`, `localhost:4201` y producción en Render. Métodos permitidos: GET, POST, PUT, PATCH, DELETE, OPTIONS.

**application.properties / application.yml** (contenido equivalente en ambos formatos):

```properties
server.port=${PORT:6789}
spring.datasource.url=jdbc:postgresql://localhost:5432/demo01
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=1234
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

### 3.5 Dependencias (pom.xml)

- **Starters**: `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `spring-boot-starter-validation`, `spring-boot-starter-test`
- **Drivers**: `postgresql`
- **Utilidades**: `lombok` 1.18.36
- **Plugins**: `spring-boot-maven-plugin` (repackage), `maven-compiler-plugin` 3.8.1

---

## 4. Frontend

### 4.1 Estructura Angular 17 (Standalone + Lazy Loading)

```
Frontend/
├── .editorconfig
├── .gitignore
├── .vscode/
│   ├── extensions.json
│   ├── launch.json
│   └── tasks.json
├── angular.json
├── package.json
├── proxy.conf.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
└── src/
    ├── favicon.ico
    ├── index.html
    ├── main.ts
    ├── styles.css
    ├── assets/
    └── app/
        ├── app.component.ts
        ├── app.component.html
        ├── app.component.css
        ├── app.config.ts
        ├── app.routes.ts
        ├── core/
        │   └── services/         → VACÍO
        ├── features/
        │   ├── auth/             → VACÍO
        │   ├── estudiantes/      → VACÍO
        │   ├── reservas/         → VACÍO
        │   └── salas/            → VACÍO
        └── shared/
            └── components/
                ├── footer/       → VACÍO
                ├── header/       → VACÍO
                ├── mensaje/      → VACÍO
                ├── menu/         → VACÍO
                └── sala-card/    → VACÍO
```

### 4.2 Enrutamiento (app.routes.ts)

| Ruta | Feature | Componente (lazy) |
|---|---|---|
| `/` | — | redirect → `/login` |
| `/login` | auth | `LoginComponent` |
| `/register` | auth | `RegisterComponent` |
| `/salas` | salas | `SalasComponent` |
| `/reservas` | reservas | `ReservasComponent` |
| `/estudiantes` | estudiantes | `EstudiantesComponent` |
| `**` | — | redirect → `/login` |

### 4.3 Configuración del Frontend

**proxy.conf.json**: `/api` → `http://localhost:6789` (proxy de desarrollo para Angular CLI).

**angular.json**: Build con outputPath `dist/s2-atw`, estilos incluyen Bootstrap desde `node_modules`.

**package.json**: Scripts `start` (`ng serve`), `build` (`ng build`), `test` (`ng test`).

---

## 5. Estado de Completitud

| Módulo | Componente | Estado |
|---|---|---|
| **Backend** | Entidades JPA (7) | ✅ COMPLETO |
| | Repositorios (2) | ✅ COMPLETO |
| | Config CORS | ✅ COMPLETO |
| | Config BD / properties | ✅ COMPLETO |
| | Interfaces de servicio | ❌ PENDIENTE |
| | Clases de servicio | ❌ PENDIENTE |
| | DTOs | ❌ PENDIENTE |
| | Controladores REST | ❌ PENDIENTE |
| | Seed de datos | ❌ PENDIENTE |
| | Dockerfile | ❌ PENDIENTE |
| **Frontend** | Estructura base Angular | ✅ COMPLETO |
| | Componentes de features | ❌ PENDIENTE |
| | Componentes compartidos | ❌ PENDIENTE |
| | Servicios core | ❌ PENDIENTE |
| | Estilos y maquetación | ❌ PENDIENTE |
| **Calidad** | Pruebas automatizadas | ❌ NO EXISTEN |

---

## 6. Próximos Pasos (orden sugerido)

1. Implementar **interfaces de servicio** y **clases de servicio** en backend
2. Implementar **DTOs** para cada entidad
3. Implementar **controladores REST** bajo `/api/v1/`
4. Configurar **seed de datos** para catálogos (carreras, edificios, estados)
5. Desarrollar **componentes de feature**: auth, salas, reservas, estudiantes
6. Desarrollar **componentes compartidos**: header, footer, menu, mensaje, sala-card
7. Implementar **servicios Angular** para consumo de API REST
8. Maquetar estilos y pulir UX
9. Evaluar Dockerfile y configuración de despliegue

---

## 7. Historial de Cambios

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0 | 03-jun-2026 | Versión inicial: documentación de entidades, repositorios, estructura Angular y estado del proyecto |
