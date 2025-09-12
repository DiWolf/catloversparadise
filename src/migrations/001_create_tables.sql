-- Migración 001: Crear tablas de la base de datos
-- Ejecutar: npm run init-db

-- Crear tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- Crear tabla de gatos
CREATE TABLE IF NOT EXISTS cats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(50) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    characteristics TEXT,
    temperament TEXT,
    care TEXT,
    hero_image VARCHAR(255),
    main_image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
);

-- Crear tabla de traducciones de gatos
CREATE TABLE IF NOT EXISTS cat_translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cat_id INT NOT NULL,
    language VARCHAR(5) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    characteristics TEXT,
    temperament TEXT,
    care TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cat_id) REFERENCES cats(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cat_language (cat_id, language)
);

-- Insertar roles por defecto
INSERT INTO roles (name, description, permissions) VALUES 
('Admin', 'Administrador completo del sistema', '["all"]'),
('Editor', 'Editor de contenido', '["read", "write", "update"]'),
('Viewer', 'Solo lectura', '["read"]');

-- Insertar usuario administrador por defecto
INSERT INTO users (username, email, password_hash, first_name, last_name, role_id) VALUES 
('admin', 'admin@catloversparadise.com', '$2b$10$ATdiVLRQV.1qtv.fQs3rzOrVp43Q5urUo7pnHMk1RoYKYn44Olg4W', 'Admin', 'User', 1);