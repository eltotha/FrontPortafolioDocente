DROP DATABASE universidaddb;

CREATE DATABASE universidaddb;

use universidaddb;
-- 1. CONFIGURACIÓN DEL ENTORNO E HISTORIAL
CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) NOT NULL,
    `ProductVersion` varchar(32) NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
);

START TRANSACTION;

-- Forzar codificación correcta a nivel de base de datos
ALTER DATABASE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ==========================================================================
-- 2. CREACIÓN DE TABLAS E ÍNDICES
-- ==========================================================================

CREATE TABLE `Escuelas` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Nombre` varchar(150) NOT NULL,
    `Estado` varchar(50) NOT NULL,
    CONSTRAINT `PK_Escuelas` PRIMARY KEY (`Id`)
);

CREATE TABLE `TiposUsuarios` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `TpNombre` varchar(100) NOT NULL,
    `TpDescripcion` varchar(255) NULL,
    CONSTRAINT `PK_TiposUsuarios` PRIMARY KEY (`Id`)
);

CREATE TABLE `Carreras` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Nombre` varchar(150) NOT NULL,
    `Estado` varchar(50) NOT NULL,
    `EscuelaId` int NOT NULL,
    CONSTRAINT `PK_Carreras` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Carreras_Escuelas_EscuelaId` FOREIGN KEY (`EscuelaId`) REFERENCES `Escuelas` (`Id`) ON DELETE CASCADE
);
CREATE INDEX `IX_Carreras_EscuelaId` ON `Carreras` (`EscuelaId`);

CREATE TABLE `Materias` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Nombre` varchar(150) NOT NULL,
    `Descripcion` varchar(500) NULL,
    `Estado` varchar(50) NOT NULL,
    `EscuelaId` int NOT NULL,
    CONSTRAINT `PK_Materias` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Materias_Escuelas_EscuelaId` FOREIGN KEY (`EscuelaId`) REFERENCES `Escuelas` (`Id`) ON DELETE CASCADE
);
CREATE INDEX `IX_Materias_EscuelaId` ON `Materias` (`EscuelaId`);

CREATE TABLE `Usuarios` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Nombre` varchar(100) NOT NULL,
    `Apellido` varchar(100) NOT NULL,
    `FechaNac` datetime(6) NOT NULL,
    `Correo` varchar(150) NOT NULL,
    `Username` varchar(50) NOT NULL,
    `Password` varchar(255) NOT NULL,
    `Estado` varchar(50) NOT NULL,
    `TipoUsuarioId` int NOT NULL,
    `EscuelaId` int NOT NULL,
    CONSTRAINT `PK_Usuarios` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Usuarios_Escuelas_EscuelaId` FOREIGN KEY (`EscuelaId`) REFERENCES `Escuelas` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_Usuarios_TiposUsuarios_TipoUsuarioId` FOREIGN KEY (`TipoUsuarioId`) REFERENCES `TiposUsuarios` (`Id`) ON DELETE CASCADE
);
CREATE INDEX `IX_Usuarios_EscuelaId` ON `Usuarios` (`EscuelaId`);
CREATE INDEX `IX_Usuarios_TipoUsuarioId` ON `Usuarios` (`TipoUsuarioId`);

CREATE TABLE `Grupos` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Codigo` varchar(50) NOT NULL,
    `MateriaId` int NOT NULL,
    CONSTRAINT `PK_Grupos` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Grupos_Materias_MateriaId` FOREIGN KEY (`MateriaId`) REFERENCES `Materias` (`Id`) ON DELETE CASCADE
);
CREATE INDEX `IX_Grupos_MateriaId` ON `Grupos` (`MateriaId`);

CREATE TABLE `MateriasCarreras` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `MateriaId` int NOT NULL,
    `CarreraId` int NOT NULL,
    CONSTRAINT `PK_MateriasCarreras` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_MateriasCarreras_Carreras_CarreraId` FOREIGN KEY (`CarreraId`) REFERENCES `Carreras` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_MateriasCarreras_Materias_MateriaId` FOREIGN KEY (`MateriaId`) REFERENCES `Materias` (`Id`) ON DELETE CASCADE
);
CREATE INDEX `IX_MateriasCarreras_CarreraId` ON `MateriasCarreras` (`CarreraId`);
CREATE INDEX `IX_MateriasCarreras_MateriaId` ON `MateriasCarreras` (`MateriaId`);

-- ==========================================================================
-- 3. INSERCIÓN DE DATOS SEMILLA
-- ==========================================================================

INSERT INTO `Escuelas` (`Id`, `Estado`, `Nombre`) VALUES 
(1, 'Operativa', 'Escuela de Ingeniería en Sistemas'),
(2, 'Operativa', 'Escuela de Ciencias Sociales'),
(3, 'Operativa', 'Escuela de Medicina');

INSERT INTO `TiposUsuarios` (`Id`, `TpDescripcion`, `TpNombre`) VALUES 
(1, 'Usuario con privilegios completos', 'Administrador'),
(2, 'Usuario con permisos para gestionar materias', 'Docente');

INSERT INTO `Carreras` (`Id`, `EscuelaId`, `Estado`, `Nombre`) VALUES 
(1, 1, 'Operativa', 'Ingeniería en Sistemas'),
(2, 2, 'Operativa', 'Ciencias Sociales'),
(3, 3, 'Operativa', 'Medicina');

INSERT INTO `Materias` (`Id`, `Descripcion`, `EscuelaId`, `Estado`, `Nombre`) VALUES 
(1, 'Curso introductorio a las matemáticas discretas', 1, 'Disponible', 'Matemáticas Discretas'),
(2, 'Fundamentos de física clásica', 1, 'Disponible', 'Física General'),
(3, 'Curso que cubre técnicas avanzadas', 1, 'Disponible', 'Programación Avanzada'),
(4, 'Estudio de la estructura del cuerpo humano', 3, 'Disponible', 'Anatomía Humana');

INSERT INTO `Usuarios` (`Id`, `Apellido`, `Correo`, `EscuelaId`, `Estado`, `FechaNac`, `Nombre`, `Password`, `TipoUsuarioId`, `Username`) VALUES 
(1, 'Gonzalez', 'eduar2.gm2020@gmail.com', 1, 'Activo', '2000-02-27 00:00:00', 'Eduardo', 'eduardo', 1, 'eduardo'),
(2, 'Gonzalez', 'sngm@gmail.com', 3, 'Activo', '2006-09-23 00:00:00', 'Sofia', 'sofia', 2, 'sofia');

-- Actualizar el historial de EF Core
INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260622052544_InitialCreate', '8.0.12');

COMMIT;