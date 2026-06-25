# Guía de Validaciones — REQ 12

## 1. Error de sala ya reservada (arreglado)

**Problema original:** Al reservar una sala ya ocupada se veía un mensaje HTTP genérico.
**Causa:** Backend devolvía `{"error": "..."}` pero frontend buscaba `err.error?.message`.
**Fix:** Se unificó a `{"message": "..."}` en `GlobalExceptionHandler.java`.

### Prueba:
1. Crear una reserva (ej. Sala A1, 08:00-10:00, fecha futura)
2. Intentar crear otra reserva idéntica (misma sala, mismo horario, misma fecha)
3. ✅ Resultado: debe mostrar "Ya existe una reserva confirmada para esta sala, horario y fecha."

---

## 2. Validaciones Backend (nuevas)

### GlobalExceptionHandler
| Archivo | Cambio |
|---------|--------|
| `controller/GlobalExceptionHandler.java` | `"error"` → `"message"`; + handler para `MethodArgumentNotValidException` |

### DTOs con anotaciones Jakarta Validation
| DTO | Campos validados |
|-----|-----------------|
| `ReservaRequestDTO` | `fechaReserva: @NotNull @Future`, `observacion: @NotNull @Size(min=15)`, `estudianteId/salaId/horarioDisponibleId/estadoReservaId: @NotNull` |
| `LoginRequestDTO` | `username: @NotBlank`, `password: @NotBlank @Size(min=4)` |

### Controllers con @Valid
| Controller | Endpoint |
|------------|----------|
| `ReservaController.createReserva` | `POST /api/reservas` |
| `AuthController.login` | `POST /api/auth/login` |

---

## 3. Validaciones Frontend (nuevas/mejoradas)

### Login (`login.component.ts`)
| Validación | Mensaje |
|------------|---------|
| Campo vacío | "Ingresa un correo electrónico." |
| Formato email inválido | "Ingresa un correo electrónico válido (ej: nombre@correo.com)." |
| Password < 4 caracteres | "La contraseña debe tener al menos 4 caracteres." |
| Backend caído | "No se pudo conectar con el servidor..." |

### Registro (`register.component.ts`)
| Validación | Mensaje |
|------------|---------|
| Campo vacío | "Ingresa un correo electrónico." |
| Formato email inválido | "Ingresa un correo electrónico válido (ej: nombre@correo.com)." |
| Password < 6 caracteres | "La contraseña debe tener al menos 6 caracteres." |

### Reserva Form (`reserva-form.component.ts/.html`)
| Validación | Mensaje |
|------------|---------|
| Fecha anterior a hoy | "La fecha no puede ser anterior a hoy." |
| Fecha > 6 meses en futuro | "La fecha no puede superar los 6 meses desde hoy." |
| Observación < 15 caracteres | "La observación debe tener al menos 15 caracteres." |
| Campos requeridos | Mensajes específicos por campo |

### Campos date con `[min]="hoy"`
| Componente | Input |
|------------|-------|
| `salas.component.html` | `fechaFilter` |
| `reservas.component.html` | `selectedFecha` |
| `reserva-form.component.html` | `fechaReserva` |

### Atributos HTML adicionales
| Componente | Atributos |
|------------|-----------|
| Login | `type="email"`, `autocomplete`, `minlength="4"` |
| Registro | `type="email"`, `autocomplete`, `minlength="6"` |
| Reserva Form | `maxlength="100"` en búsqueda, `minlength="15"` en observación |

---

## 4. Archivos modificados (resumen)

| Archivo | Cambio |
|---------|--------|
| `Backend/.../GlobalExceptionHandler.java` | Key `"error"` → `"message"`, + handler `MethodArgumentNotValidException` |
| `Backend/.../dto/ReservaRequestDTO.java` | Anotaciones `@NotNull`, `@Future`, `@Size` |
| `Backend/.../dto/LoginRequestDTO.java` | Anotaciones `@NotBlank`, `@Size` |
| `Backend/.../controller/ReservaController.java` | `@Valid` en `createReserva` |
| `Backend/.../controller/AuthController.java` | `@Valid` en `login` |
| `Frontend/.../login.component.ts` | Validación email + password + minlength |
| `Frontend/.../register.component.ts` | Validación email + password + minlength |
| `Frontend/.../reserva-form.component.ts` | Validador fecha máxima (6 meses) |
| `Frontend/.../reserva-form.component.html` | Mensaje fecha máxima, minlength, maxlength |
| `Frontend/.../salas.component.html` | `[min]="hoy"` en filtro fecha |
| `Frontend/.../reservas.component.html` | `[min]="hoy"` en selector fecha |
