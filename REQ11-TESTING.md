# Guía de Pruebas — REQ 11: Frontend con Backend Detenido

## Escenario A: Backend completamente detenido

1. Detener el backend (`Ctrl + C` en la terminal donde corre `mvnw spring-boot:run`)
2. Mantener el frontend corriendo (`npm start` en `Frontend/`)
3. Ejecutar cada prueba:

| # | Acción | Mensaje esperado (fracaso) |
|---|--------|---------------------------|
| A1 | Ir a `http://localhost:4200/salas` | "No se pudieron cargar las salas. Verifica tu conexión." |
| A2 | Ir a `http://localhost:4200/reservas` | "No se pudieron cargar las salas. Verifica tu conexión." |
| A3 | En `/reservas`, seleccionar una sala y fecha | "No se pudieron cargar las reservas. Verifica tu conexión." |
| A4 | Ir a `http://localhost:4200/reservas/nueva` | "No se pudieron cargar las salas. Verifica tu conexión." |
| A5 | En `/reservas/nueva`, escribir un nombre en "Buscar estudiante" | "Error al buscar estudiantes. Verifica tu conexión." |
| A6 | Ir a `http://localhost:4200/estudiantes`, escribir RUT y buscar | "Error al buscar estudiantes. Verifica tu conexión." |
| A7 | Ir a `http://localhost:4200/login`, ingresar credenciales y presionar "Ingresar" | "No se pudo conectar con el servidor. Verifica tu conexión." |

## Escenario B: Backend funcionando (mensajes de éxito)

1. Iniciar backend (`./mvnw spring-boot:run` en `Backend/`)
2. Ejecutar cada prueba:

| # | Acción | Mensaje esperado (éxito) |
|---|--------|--------------------------|
| B1 | Ir a `http://localhost:4200/salas` | "Salas cargadas correctamente." (desaparece a los 3 segundos) |
| B2 | En `/salas`, seleccionar fecha con disponibilidad | "Salas disponibles cargadas correctamente." |
| B3 | Ir a `http://localhost:4200/login`, loguearse con `test@test.cl` / `1234` | Redirige a `/salas` (sin mensaje de error) |
| B4 | Ir a `/reservas/nueva`, llenar datos y enviar | "Reserva creada exitosamente. Redirigiendo..." y luego redirige a `/reservas` |
| B5 | Ir a `/reservas/nueva` e intentar crear reserva duplicada | "Ya existe una reserva confirmada para esta sala, horario y fecha." |

## Escenario C: Backend responde con error 500

Si el backend tiene un error interno (por ejemplo, base de datos caída pero servidor corriendo):

| # | Mensaje esperado |
|---|------------------|
| C1 | "Error interno del servidor. Intenta nuevamente más tarde." |
