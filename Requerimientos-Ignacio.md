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
