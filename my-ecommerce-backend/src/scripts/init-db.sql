-- Script de inicialización para la base de datos MySQL
-- Ejecutar este script en MySQL para crear la base de datos

CREATE DATABASE IF NOT EXISTS tienda CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE tienda;

-- La tabla Products será creada automáticamente por Sequelize
-- Este script solo asegura que la base de datos existe

-- Opcional: Crear un usuario específico para la aplicación
-- CREATE USER IF NOT EXISTS 'ecommerce_user'@'localhost' IDENTIFIED BY 'secure_password';
-- GRANT ALL PRIVILEGES ON tienda.* TO 'ecommerce_user'@'localhost';
-- FLUSH PRIVILEGES;