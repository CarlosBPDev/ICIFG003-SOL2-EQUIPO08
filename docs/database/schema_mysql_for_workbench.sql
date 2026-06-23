CREATE SCHEMA IF NOT EXISTS `demo01` DEFAULT CHARACTER SET utf8mb4;
USE `demo01`;

CREATE TABLE `carrera` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre_carrera` VARCHAR(100) NOT NULL,
  `facultad` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `estudiante` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `rut` VARCHAR(15) NOT NULL,
  `nombre` VARCHAR(50) NOT NULL,
  `apellido` VARCHAR(50) NOT NULL,
  `correo` VARCHAR(100) NOT NULL,
  `telefono` VARCHAR(20),
  `fecha_registro` DATE,
  `id_carrera` INT,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_estudiante_carrera` FOREIGN KEY (`id_carrera`) REFERENCES `carrera` (`id`)
);

CREATE TABLE `edificio` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre_edificio` VARCHAR(100) NOT NULL,
  `direccion` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `sala` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `codigo_sala` VARCHAR(20) NOT NULL,
  `nombre_sala` VARCHAR(50) NOT NULL,
  `capacidad` INT NOT NULL,
  `piso` INT NOT NULL,
  `descripcion` VARCHAR(255),
  `estado` VARCHAR(50),
  `id_edificio` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_sala_edificio` FOREIGN KEY (`id_edificio`) REFERENCES `edificio` (`id`)
);

CREATE TABLE `horario_disponible` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `hora_inicio` TIME NOT NULL,
  `hora_termino` TIME NOT NULL,
  `sala_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_horario_sala` FOREIGN KEY (`sala_id`) REFERENCES `sala` (`id`)
);

CREATE TABLE `estado_reserva` (
  `id_estado` INT NOT NULL AUTO_INCREMENT,
  `nombre_estado` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id_estado`)
);

CREATE TABLE `reserva` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha_reserva` DATE NOT NULL,
  `observacion` VARCHAR(255),
  `fecha_creacion` DATETIME NOT NULL,
  `estudiante_id` INT NOT NULL,
  `sala_id` INT NOT NULL,
  `horario_disponible_id` INT NOT NULL,
  `estado_reserva_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_reserva_estudiante` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiante` (`id`),
  CONSTRAINT `fk_reserva_sala` FOREIGN KEY (`sala_id`) REFERENCES `sala` (`id`),
  CONSTRAINT `fk_reserva_horario` FOREIGN KEY (`horario_disponible_id`) REFERENCES `horario_disponible` (`id`),
  CONSTRAINT `fk_reserva_estado` FOREIGN KEY (`estado_reserva_id`) REFERENCES `estado_reserva` (`id_estado`)
);

CREATE TABLE `usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `rol` VARCHAR(50) NOT NULL,
  `id_estudiante` INT,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_usuario_estudiante` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id`)
);

CREATE TABLE `recurso` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre_recurso` VARCHAR(100) NOT NULL,
  `descripcion` VARCHAR(255),
  PRIMARY KEY (`id`)
);

CREATE TABLE `sala_recurso` (
  `sala_id` INT NOT NULL,
  `recurso_id` INT NOT NULL,
  PRIMARY KEY (`sala_id`, `recurso_id`),
  CONSTRAINT `fk_sr_sala` FOREIGN KEY (`sala_id`) REFERENCES `sala` (`id`),
  CONSTRAINT `fk_sr_recurso` FOREIGN KEY (`recurso_id`) REFERENCES `recurso` (`id`)
);
