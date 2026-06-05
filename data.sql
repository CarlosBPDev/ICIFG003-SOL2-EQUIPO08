-- =========================
-- CARRERAS (5)
-- =========================
INSERT INTO carrera (id, nombre) VALUES
(1, 'Ingeniería Informática'),
(2, 'Ingeniería Civil'),
(3, 'Arquitectura'),
(4, 'Administración de Empresas'),
(5, 'Derecho');

-- =========================
-- ESTUDIANTES (10)
-- =========================
INSERT INTO estudiante (id, nombre, email, carrera_id) VALUES
(1, 'Juan Pérez', 'juan@uni.cl', 1),
(2, 'María González', 'maria@uni.cl', 2),
(3, 'Pedro Rojas', 'pedro@uni.cl', 3),
(4, 'Ana Torres', 'ana@uni.cl', 4),
(5, 'Luis Martínez', 'luis@uni.cl', 5),
(6, 'Camila Soto', 'camila@uni.cl', 1),
(7, 'Diego Morales', 'diego@uni.cl', 2),
(8, 'Valentina Castro', 'vale@uni.cl', 3),
(9, 'Andrés Silva', 'andres@uni.cl', 4),
(10, 'Fernanda Díaz', 'fernanda@uni.cl', 5);

-- =========================
-- EDIFICIOS (3)
-- =========================
INSERT INTO edificio (id, nombre, direccion) VALUES
(1, 'Edificio Central', 'Av. Universidad 123'),
(2, 'Edificio Norte', 'Av. Norte 456'),
(3, 'Edificio Sur', 'Av. Sur 789');

-- =========================
-- SALAS (8)
-- =========================
INSERT INTO sala (id, nombre, capacidad, piso, edificio_id, imagen_url) VALUES
(1, 'Sala A1', 10, 1, 1, 'assets/img/sala1.jpg'),
(2, 'Sala A2', 15, 1, 1, 'assets/img/sala2.jpg'),
(3, 'Sala B1', 8, 2, 1, 'assets/img/sala3.jpg'),
(4, 'Sala N1', 20, 1, 2, 'assets/img/sala4.jpg'),
(5, 'Sala N2', 12, 2, 2, 'assets/img/sala5.jpg'),
(6, 'Sala S1', 25, 1, 3, 'assets/img/sala6.jpg'),
(7, 'Sala S2', 18, 2, 3, 'assets/img/sala7.jpg'),
(8, 'Sala S3', 30, 3, 3, 'assets/img/sala8.jpg');

-- =========================
-- BLOQUES HORARIOS (3 por sala)
-- =========================
INSERT INTO bloque_horario (id, hora_inicio, hora_fin, sala_id) VALUES
-- Sala 1
(1, '08:00', '10:00', 1),
(2, '10:30', '12:30', 1),
(3, '14:00', '16:00', 1),
-- Sala 2
(4, '08:00', '10:00', 2),
(5, '10:30', '12:30', 2),
(6, '14:00', '16:00', 2),
-- Sala 3
(7, '08:00', '10:00', 3),
(8, '10:30', '12:30', 3),
(9, '14:00', '16:00', 3);

-- =========================
-- ESTADOS (2)
-- =========================
INSERT INTO estado (id, nombre) VALUES
(1, 'Confirmada'),
(2, 'Cancelada');

-- =========================
-- RESERVAS (15 variadas)
-- =========================
INSERT INTO reserva (id, fecha, estudiante_id, sala_id, bloque_id, estado_id) VALUES
(1, '2026-06-01', 1, 1, 1, 1),
(2, '2026-06-01', 2, 2, 4, 1),
(3, '2026-06-02', 3, 3, 7, 2),
(4, '2026-06-02', 4, 4, 1, 1),
(5, '2026-06-03', 5, 5, 2, 1),
(6, '2026-06-03', 6, 6, 3, 2),
(7, '2026-06-04', 7, 7, 4, 1),
(8, '2026-06-04', 8, 8, 5, 1),
(9, '2026-06-05', 9, 1, 6, 1),
(10, '2026-06-05', 10, 2, 2, 2),
(11, '2026-06-06', 1, 3, 3, 1),
(12, '2026-06-06', 2, 4, 4, 1),
(13, '2026-06-07', 3, 5, 5, 2),
(14, '2026-06-07', 4, 6, 6, 1),
(15, '2026-06-08', 5, 7, 7, 1);
