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
