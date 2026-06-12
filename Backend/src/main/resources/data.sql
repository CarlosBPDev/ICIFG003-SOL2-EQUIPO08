-- =========================
-- CARRERAS (5)
-- =========================
INSERT INTO carrera (id, nombre_carrera, facultad) VALUES
(1, 'Ingeniería Informática', 'Facultad de Ingeniería'),
(2, 'Ingeniería Civil', 'Facultad de Ingeniería'),
(3, 'Arquitectura', 'Facultad de Arquitectura'),
(4, 'Administración de Empresas', 'Facultad de Ciencias Empresariales'),
(5, 'Derecho', 'Facultad de Derecho')
ON CONFLICT DO NOTHING;

-- =========================
-- ESTUDIANTES (10)
-- =========================
INSERT INTO estudiante (id, rut, nombre, apellido, correo, telefono, fecha_registro, id_carrera) VALUES
(1, '11111111-1', 'Juan', 'Pérez', 'juan@uni.cl', '912345678', '2026-01-15', 1),
(2, '22222222-2', 'María', 'González', 'maria@uni.cl', '912345679', '2026-01-15', 2),
(3, '33333333-3', 'Pedro', 'Rojas', 'pedro@uni.cl', '912345680', '2026-01-15', 3),
(4, '44444444-4', 'Ana', 'Torres', 'ana@uni.cl', '912345681', '2026-01-15', 4),
(5, '55555555-5', 'Luis', 'Martínez', 'luis@uni.cl', '912345682', '2026-01-15', 5),
(6, '66666666-6', 'Camila', 'Soto', 'camila@uni.cl', '912345683', '2026-01-15', 1),
(7, '77777777-7', 'Diego', 'Morales', 'diego@uni.cl', '912345684', '2026-01-15', 2),
(8, '88888888-8', 'Valentina', 'Castro', 'vale@uni.cl', '912345685', '2026-01-15', 3),
(9, '99999999-9', 'Andrés', 'Silva', 'andres@uni.cl', '912345686', '2026-01-15', 4),
(10, '10101010-1', 'Fernanda', 'Díaz', 'fernanda@uni.cl', '912345687', '2026-01-15', 5)
ON CONFLICT DO NOTHING;

-- =========================
-- EDIFICIOS (3)
-- =========================
INSERT INTO edificio (id, nombre_edificio, direccion) VALUES
(1, 'Edificio Central', 'Av. Universidad 123'),
(2, 'Edificio Norte', 'Av. Norte 456'),
(3, 'Edificio Sur', 'Av. Sur 789')
ON CONFLICT DO NOTHING;

-- =========================
-- SALAS (8)
-- =========================
INSERT INTO sala (id, codigo_sala, nombre_sala, capacidad, piso, descripcion, estado, id_edificio) VALUES
(1, 'A1', 'Sala A1', 10, 1, 'Sala de estudio planta baja', 'disponible', 1),
(2, 'A2', 'Sala A2', 15, 1, 'Sala de estudio planta baja', 'disponible', 1),
(3, 'B1', 'Sala B1', 8, 2, 'Sala de estudio segundo piso', 'disponible', 1),
(4, 'N1', 'Sala N1', 20, 1, 'Sala de estudio edificio norte', 'disponible', 2),
(5, 'N2', 'Sala N2', 12, 2, 'Sala de estudio segundo piso norte', 'disponible', 2),
(6, 'S1', 'Sala S1', 25, 1, 'Sala de estudio edificio sur', 'disponible', 3),
(7, 'S2', 'Sala S2', 18, 2, 'Sala de estudio segundo piso sur', 'disponible', 3),
(8, 'S3', 'Sala S3', 30, 3, 'Sala de estudio tercer piso sur', 'disponible', 3)
ON CONFLICT DO NOTHING;

-- =========================
-- HORARIOS DISPONIBLES (3 por sala = 24)
-- =========================
INSERT INTO horario_disponible (id, hora_inicio, hora_termino, sala_id) VALUES
(1,  '08:00', '10:00', 1),
(2,  '10:30', '12:30', 1),
(3,  '14:00', '16:00', 1),
(4,  '08:00', '10:00', 2),
(5,  '10:30', '12:30', 2),
(6,  '14:00', '16:00', 2),
(7,  '08:00', '10:00', 3),
(8,  '10:30', '12:30', 3),
(9,  '14:00', '16:00', 3),
(10, '08:00', '10:00', 4),
(11, '10:30', '12:30', 4),
(12, '14:00', '16:00', 4),
(13, '08:00', '10:00', 5),
(14, '10:30', '12:30', 5),
(15, '14:00', '16:00', 5),
(16, '08:00', '10:00', 6),
(17, '10:30', '12:30', 6),
(18, '14:00', '16:00', 6),
(19, '08:00', '10:00', 7),
(20, '10:30', '12:30', 7),
(21, '14:00', '16:00', 7),
(22, '08:00', '10:00', 8),
(23, '10:30', '12:30', 8),
(24, '14:00', '16:00', 8)
ON CONFLICT DO NOTHING;

-- =========================
-- ESTADOS RESERVA (2)
-- =========================
INSERT INTO estado_reserva (id_estado, nombre_estado) VALUES
(1, 'Confirmada'),
(2, 'Cancelada')
ON CONFLICT DO NOTHING;

-- =========================
-- RESERVAS (15 variadas)
-- =========================
INSERT INTO reserva (id, fecha_reserva, observacion, fecha_creacion, estudiante_id, sala_id, horario_disponible_id, estado_reserva_id) VALUES
(1,  '2026-06-01', NULL, '2026-06-01T08:00:00', 1,  1, 1,  1),
(2,  '2026-06-01', NULL, '2026-06-01T08:00:00', 2,  2, 4,  1),
(3,  '2026-06-02', NULL, '2026-06-02T08:00:00', 3,  3, 7,  2),
(4,  '2026-06-02', NULL, '2026-06-02T08:00:00', 4,  4, 10, 1),
(5,  '2026-06-03', NULL, '2026-06-03T08:00:00', 5,  5, 14, 1),
(6,  '2026-06-03', NULL, '2026-06-03T08:00:00', 6,  6, 18, 2),
(7,  '2026-06-04', NULL, '2026-06-04T08:00:00', 7,  7, 20, 1),
(8,  '2026-06-04', NULL, '2026-06-04T08:00:00', 8,  8, 23, 1),
(9,  '2026-06-05', NULL, '2026-06-05T08:00:00', 9,  1, 2,  1),
(10, '2026-06-05', NULL, '2026-06-05T08:00:00', 10, 2, 5,  2),
(11, '2026-06-06', NULL, '2026-06-06T08:00:00', 1,  3, 8,  1),
(12, '2026-06-06', NULL, '2026-06-06T08:00:00', 2,  4, 12, 1),
(13, '2026-06-07', NULL, '2026-06-07T08:00:00', 3,  5, 15, 2),
(14, '2026-06-07', NULL, '2026-06-07T08:00:00', 4,  6, 17, 1),
(15, '2026-06-08', NULL, '2026-06-08T08:00:00', 5,  7, 21, 1)
ON CONFLICT DO NOTHING;

-- =========================
-- USUARIOS (1 por estudiante = 10)
-- password: "1234" en bcrypt hash
-- =========================
DELETE FROM usuario;
INSERT INTO usuario (id, username, password_hash, rol, id_estudiante) VALUES
(1,  'juan.perez', '$2a$10$9rjxo8rPrYnIxmFntuXRXO97/y/OTFxWf2czKLjSgwpUB.YlC1zIO', 'ESTUDIANTE', 1),
(2,  'maria.gonzalez', '$2a$10$9rjxo8rPrYnIxmFntuXRXO97/y/OTFxWf2czKLjSgwpUB.YlC1zIO', 'ESTUDIANTE', 2),
(3,  'pedro.rojas', '$2a$10$9rjxo8rPrYnIxmFntuXRXO97/y/OTFxWf2czKLjSgwpUB.YlC1zIO', 'ESTUDIANTE', 3),
(4,  'ana.torres', '$2a$10$9rjxo8rPrYnIxmFntuXRXO97/y/OTFxWf2czKLjSgwpUB.YlC1zIO', 'ESTUDIANTE', 4),
(5,  'luis.martinez', '$2a$10$9rjxo8rPrYnIxmFntuXRXO97/y/OTFxWf2czKLjSgwpUB.YlC1zIO', 'ESTUDIANTE', 5),
(6,  'camila.soto', '$2a$10$9rjxo8rPrYnIxmFntuXRXO97/y/OTFxWf2czKLjSgwpUB.YlC1zIO', 'ESTUDIANTE', 6),
(7,  'diego.morales', '$2a$10$9rjxo8rPrYnIxmFntuXRXO97/y/OTFxWf2czKLjSgwpUB.YlC1zIO', 'ESTUDIANTE', 7),
(8,  'valentina.castro', '$2a$10$9rjxo8rPrYnIxmFntuXRXO97/y/OTFxWf2czKLjSgwpUB.YlC1zIO', 'ESTUDIANTE', 8),
(9,  'andres.silva', '$2a$10$9rjxo8rPrYnIxmFntuXRXO97/y/OTFxWf2czKLjSgwpUB.YlC1zIO', 'ESTUDIANTE', 9),
(10, 'fernanda.diaz', '$2a$10$9rjxo8rPrYnIxmFntuXRXO97/y/OTFxWf2czKLjSgwpUB.YlC1zIO', 'ESTUDIANTE', 10)
ON CONFLICT DO NOTHING;

-- =========================
-- RECURSOS (6 tipos de recursos)
-- =========================
INSERT INTO recurso (id, nombre_recurso, descripcion) VALUES
(1, 'Proyector', 'Proyector multimedia HDMI y VGA'),
(2, 'Pizarra', 'Pizarra blanca con marcadores'),
(3, 'Computador', 'Computador de escritorio con monitor'),
(4, 'TV 55"', 'Televisor 55 pulgadas Smart TV'),
(5, 'Aire Acondicionado', 'Sistema de climatización'),
(6, 'Cámara Web', 'Cámara para videoconferencias')
ON CONFLICT DO NOTHING;

-- =========================
-- SALA_RECURSO (vincular recursos a salas)
-- =========================
INSERT INTO sala_recurso (sala_id, recurso_id) VALUES
(1, 1), (1, 2), (1, 5),
(2, 1), (2, 2), (2, 3), (2, 5),
(3, 1), (3, 2),
(4, 1), (4, 2), (4, 4), (4, 6),
(5, 1), (5, 2), (5, 3),
(6, 1), (6, 2), (6, 4), (6, 5), (6, 6),
(7, 1), (7, 2), (7, 5),
(8, 1), (8, 2), (8, 3), (8, 4)
ON CONFLICT DO NOTHING;

-- Sincronizar secuencias después de inserts con IDs explícitos
SELECT setval('reserva_id_seq', COALESCE((SELECT MAX(id) FROM reserva), 1));
SELECT setval('estudiante_id_seq', COALESCE((SELECT MAX(id) FROM estudiante), 1));
SELECT setval('sala_id_seq', COALESCE((SELECT MAX(id) FROM sala), 1));
SELECT setval('horario_disponible_id_seq', COALESCE((SELECT MAX(id) FROM horario_disponible), 1));
SELECT setval('carrera_id_seq', COALESCE((SELECT MAX(id) FROM carrera), 1));
SELECT setval('edificio_id_seq', COALESCE((SELECT MAX(id) FROM edificio), 1));
SELECT setval('usuario_id_seq', COALESCE((SELECT MAX(id) FROM usuario), 1));
SELECT setval('recurso_id_seq', COALESCE((SELECT MAX(id) FROM recurso), 1));
