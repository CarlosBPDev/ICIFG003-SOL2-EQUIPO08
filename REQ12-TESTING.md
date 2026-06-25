# Guía de Pruebas — REQ 12: Validaciones y Mensajes de Información

## Validaciones Frontend

### Login (`/login`)

| # | Acción | Resultado esperado |
|---|--------|-------------------|
| 1 | Dejar correo vacío y presionar "Ingresar" | "Ingresa un correo electrónico." |
| 2 | Escribir correo sin formato válido (ej: `correo-invalido`) | "Ingresa un correo electrónico válido (ej: nombre@correo.com)." |
| 3 | Escribir email válido pero contraseña < 4 caracteres | "La contraseña debe tener al menos 4 caracteres." |
| 4 | Escribir email válido, contraseña ≥ 4 caracteres, credenciales incorrectas | "Correo o contraseña incorrectos." |
| 5 | Backend detenido, credenciales correctas | "No se pudo conectar con el servidor. Verifica tu conexión." |

### Register (`/register`)

| # | Acción | Resultado esperado |
|---|--------|-------------------|
| 1 | Dejar correo vacío y presionar "Registrarse" | "Ingresa un correo electrónico." |
| 2 | Escribir correo sin formato válido | "Ingresa un correo electrónico válido (ej: nombre@correo.com)." |
| 3 | Escribir email válido pero contraseña < 6 caracteres | "La contraseña debe tener al menos 6 caracteres." |
| 4 | Email no registrado en BD | "No existe un estudiante registrado con este correo institucional. Contacta a la biblioteca." |

### Reserva Form (`/reservas/nueva`)

| # | Acción | Resultado esperado |
|---|--------|-------------------|
| 1 | No seleccionar estudiante y enviar | "Debes seleccionar un estudiante." |
| 2 | Seleccionar fecha pasada | error del validador: "La fecha no puede ser anterior a hoy." |
| 3 | Seleccionar fecha > 6 meses en el futuro | error del validador: "La fecha no puede superar los 6 meses desde hoy." |
| 4 | No seleccionar sala y enviar | "Debes seleccionar una sala." |
| 5 | No seleccionar horario y enviar | "Debes seleccionar un horario." |
| 6 | Observación vacía y enviar | "La observación es obligatoria." |
| 7 | Observación < 15 caracteres y enviar | "La observación debe tener al menos 15 caracteres." |
| 8 | Todos los campos válidos, sala+horario ya reservados | "Ya existe una reserva confirmada para esta sala, horario y fecha. Por favor selecciona otro horario." |
| 9 | Todos los campos válidos, sin conflicto | "Reserva creada exitosamente. Redirigiendo..." y a los 1.5s redirige a `/reservas` |

### Salas (`/salas`)

| # | Acción | Resultado esperado |
|---|--------|-------------------|
| 1 | Cargar página sin filtro de fecha | "Salas cargadas correctamente." (desaparece a los 3s) |
| 2 | Seleccionar fecha con disponibilidad | "Salas disponibles cargadas correctamente." |
| 3 | Backend detenido | "No se pudieron cargar las salas. Verifica tu conexión." |
| 4 | Fecha selector: no permite fechas anteriores a hoy | `[min]="hoy"` bloquea selección de fechas pasadas |

## Validaciones Backend

### Login endpoint (`POST /auth/login`)

| # | Payload | Código esperado | Mensaje |
|---|---------|-----------------|---------|
| 1 | `{}` | 400 | "El correo es obligatorio; La contraseña es obligatoria" |
| 2 | `{"username":"test@test.cl","password":"12"}` | 400 | "La contraseña debe tener al menos 4 caracteres" |
| 3 | `{"username":"test@test.cl","password":"1234"}` | 200 | Login exitoso |

### Crear Reserva (`POST /reservas`)

| # | Payload | Código esperado | Mensaje |
|---|---------|-----------------|---------|
| 1 | `{}` | 400 | "La fecha de reserva es obligatoria; La observación es obligatoria; El estudiante es obligatorio; ..." |
| 2 | Fecha en pasado | 400 | "La fecha de reserva debe ser futura" |
| 3 | Observación < 15 chars | 400 | "La observación debe tener al menos 15 caracteres" |
| 4 | Payload válido, sala+horario+duplicado | 400 | mensaje con "conflicto" o "ya existe" |
| 5 | Payload válido, sin conflicto | 201 | Reserva creada exitosamente |
