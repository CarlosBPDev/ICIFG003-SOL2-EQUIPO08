# Requerimientos - Ignacio

## Requerimiento 5: DDL con Hibernate + data.sql (solo DML)

### Descripción
Asegurar la creación del esquema de base de datos mediante Hibernate
(sin scripts DDL). Los scripts DML están permitidos únicamente en
`data.sql`, siguiendo el estándar de Spring Boot.

### Cambios realizados
- `Backend/src/main/resources/application.yml` → Eliminado (duplicaba
  configuración y podía sobrescribir propiedades clave del
  `application.properties`).
- `Backend/src/main/resources/application.properties` → Actualizado
  con comentarios que documentan la estrategia DDL/DML.

### Impacto / Propósito
- Hibernate genera automáticamente las tablas y relaciones al iniciar
  la aplicación (`ddl-auto=update`), evitando scripts DDL manuales.
- `data.sql` se ejecuta después del DDL de Hibernate
  (`defer-datasource-initialization=true`) e inyecta solo datos
  semilla (INSERTs), sin interferir con la estructura de tablas.
- Se eliminó la duplicación de config para prevenir conflictos de
  propiedades entre `.properties` y `.yml`.

## Requerimiento 6: Migrar Backend de PostgreSQL a MySQL

### Descripción
Cambiar la base de datos del proyecto de PostgreSQL a MySQL,
actualizando dependencias, configuración de conexión y sintaxis SQL
del script de datos semilla.

### Cambios realizados
- `Backend/pom.xml` → Reemplazada dependencia `postgresql` por
  `mysql-connector-java` (runtime scope).
- `Backend/src/main/resources/application.properties` → Actualizada
  URL de conexión (`jdbc:mysql://localhost:3306/demo01`), dialecto
  (`MySQL8Dialect`), usuario (`root`), sin contraseña. Eliminada
  propiedad `hibernate.jdbc.lob.non_contextual_creation` (específica
  de PostgreSQL).
- `Backend/src/main/resources/data.sql` → Migrada sintaxis:
  - `ON CONFLICT DO NOTHING` → `INSERT IGNORE` (9 sentencias).
  - `SELECT setval(...)` → `ALTER TABLE ... AUTO_INCREMENT = N`
    (8 secuencias).
- `README.md` → Actualizada tabla de versiones (PostgreSQL 14+ →
  MySQL 8.0+) y comando de creación de BD (`psql` → `mysql`).

### Impacto / Propósito
- El backend ahora funciona exclusivamente con MySQL 8.0+.
- Hibernate sigue generando el DDL automáticamente; el driver y
  dialecto son compatibles con MySQL.
- `data.sql` usa sintaxis válida en MySQL (`INSERT IGNORE` en lugar
  de `ON CONFLICT`, `ALTER TABLE AUTO_INCREMENT` en lugar de
  `setval`).

## Requerimiento 7: Creación automática de tablas con Hibernate

### Descripción
Las tablas de la base de datos deben crearse automáticamente al
ejecutar el backend, sin escribir scripts DDL manuales. Hibernate
debe generar el esquema desde las entidades JPA.

### Cambios realizados
Ninguno adicional: ya implementado en el Requerimiento 5 mediante
`spring.jpa.hibernate.ddl-auto=update` en `application.properties`.

### Impacto / Propósito
- Al iniciar el backend, Hibernate escanea las entidades `@Entity` y
  genera automáticamente las sentencias `CREATE TABLE`, `ALTER TABLE`
  y constraints necesarias.
- No existen archivos DDL manuales (`schema.sql`, `import.sql`).
- Si se agrega una nueva entidad o campo, Hibernate actualiza el
  esquema automáticamente al reiniciar, sin pérdida de datos
  (comportamiento `update`).

## Requerimiento 10: Implementar Loggers

### Descripción
Agregar loggers en backend y frontend que registren eventos
importantes de la aplicación. En el backend los logs se escriben
en `backend.log`; en el frontend se muestran en la consola del
navegador a través de un servicio LoggerService.

### Cambios realizados
- `Backend/src/main/resources/application.properties` → Agregada
  configuración `logging.file.name=backend.log`, level INFO y
  pattern personalizado.
- `Backend/.../controller/*Controller.java` (10 archivos) → Agregado
  `@Slf4j` + `log.info()`/`log.warn()`/`log.error()` en endpoints
  clave.
- `Backend/.../controller/GlobalExceptionHandler.java` → Agregado
  `log.error()` con stacktrace completo.
- `Backend/.../service/ReservaService.java` → Agregado `@Slf4j` +
  logs informativos y de advertencia en flujo de creación de
  reservas.
- `Backend/.../Test01Application.java` → Agregado `@Slf4j` + log de
  inicio de aplicación.
- `Frontend/src/app/services/logger.service.ts` → **Creado** servicio
  con métodos `info()`, `warn()`, `error()`, `debug()` que envuelven
  `console.info/warn/error/debug`.
- `Frontend/.../services/*.ts` (5 servicios) → Inyectado
  `LoggerService` y agregados logs en métodos principales.
- `Frontend/.../pages/*.ts` (7 componentes) → Inyectado
  `LoggerService` y agregados logs en `ngOnInit()` y acciones de
  usuario.
- `Frontend/.../shared/components/*.ts` (3 componentes) → Inyectado
  `LoggerService` con logs básicos.

### Impacto / Propósito
- El backend registra en `backend.log` cada operación relevante
  (login, creación de reservas, búsquedas, errores), facilitando la
  depuración y el monitoreo.
- Las excepciones no manejadas ahora quedan registradas con su
  stacktrace completo (antes solo se devolvían como HTTP 400 sin
  registro).
- El frontend tiene trazabilidad en consola del navegador para
  depuración durante el desarrollo.
- La abstracción con `LoggerService` permite cambiar el destino de
  los logs (API, archivo, etc.) sin modificar cada componente.
