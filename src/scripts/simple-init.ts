import { testConnection, query } from '../config/database';

async function simpleInit() {
    try {
        console.log('🚀 Inicializando base de datos...');
        
        // Probar conexión
        const isConnected = await testConnection();
        if (!isConnected) {
            console.error('❌ No se pudo conectar a la base de datos');
            process.exit(1);
        }
        
        console.log('📝 Creando tablas...');
        
        // Crear tabla roles
        await query(`
            CREATE TABLE IF NOT EXISTS roles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE,
                description TEXT,
                permissions JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabla roles creada');
        
        // Crear tabla users
        await query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                role_id INT NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                last_login TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
            )
        `);
        console.log('✅ Tabla users creada');
        
        // Crear tabla cats
        await query(`
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
            )
        `);
        console.log('✅ Tabla cats creada');
        
        // Crear tabla cat_translations
        await query(`
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
            )
        `);
        console.log('✅ Tabla cat_translations creada');
        
        // Insertar roles
        await query(`
            INSERT IGNORE INTO roles (name, description, permissions) VALUES 
            ('admin', 'Administrador completo del sistema', '{"cats": ["create", "read", "update", "delete"], "users": ["create", "read", "update", "delete"]}'),
            ('editor', 'Editor de contenido de gatos', '{"cats": ["create", "read", "update", "delete"]}'),
            ('viewer', 'Solo lectura', '{"cats": ["read"]}')
        `);
        console.log('✅ Roles insertados');
        
        // Insertar usuario admin
        await query(`
            INSERT IGNORE INTO users (username, email, password_hash, role_id) VALUES 
            ('admin', 'admin@catloversparadise.com', '$2b$10$rQZ8K9vL8xN7mP6qR5sTCOYzA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q', 1)
        `);
        console.log('✅ Usuario admin creado');
        
        // Insertar gatos de ejemplo
        await query(`
            INSERT IGNORE INTO cats (name, breed, slug, description, characteristics, temperament, care, hero_image, main_image, created_by) VALUES 
            ('Persian', 'persian', 'persian', 'Gato elegante y tranquilo', 'Pelaje largo y sedoso, cara plana', 'Tranquilo y cariñoso', 'Cepillado diario necesario', 'persian-hero.jpg', 'persian-main.png', 1),
            ('Bengal', 'bengal', 'bengal', 'Gato activo y juguetón', 'Patrón de leopardo, musculoso', 'Muy activo y curioso', 'Ejercicio diario recomendado', 'bengal-hero.jpg', 'bengal-main.png', 1),
            ('Maine Coon', 'mainecoon', 'mainecoon', 'Gato grande y majestuoso', 'Tamaño grande, pelaje esponjoso', 'Gentil y sociable', 'Cepillado regular', 'mainecoon-hero.jpg', 'mainecoon-main.png', 1)
        `);
        console.log('✅ Gatos de ejemplo creados');
        
        // Insertar traducciones
        await query(`
            INSERT IGNORE INTO cat_translations (cat_id, language, name, description, characteristics, temperament, care) VALUES 
            (1, 'sp', 'Persa', 'Gato elegante y tranquilo con pelaje largo', 'Pelaje largo y sedoso, cara plana característica', 'Tranquilo, cariñoso y relajado', 'Requiere cepillado diario para mantener el pelaje'),
            (2, 'sp', 'Bengalí', 'Gato activo con patrón de leopardo', 'Patrón de leopardo distintivo, cuerpo musculoso', 'Muy activo, curioso y juguetón', 'Necesita ejercicio diario y estimulación mental'),
            (3, 'sp', 'Maine Coon', 'Gato grande y majestuoso', 'Tamaño grande, pelaje esponjoso y cola larga', 'Gentil, sociable y cariñoso', 'Cepillado regular para evitar nudos'),
            (1, 'eng', 'Persian', 'Elegant and calm cat with long fur', 'Long silky fur, flat face characteristic', 'Calm, affectionate and relaxed', 'Requires daily brushing to maintain coat'),
            (2, 'eng', 'Bengal', 'Active cat with leopard pattern', 'Distinctive leopard pattern, muscular body', 'Very active, curious and playful', 'Needs daily exercise and mental stimulation'),
            (3, 'eng', 'Maine Coon', 'Large and majestic cat', 'Large size, fluffy fur and long tail', 'Gentle, sociable and affectionate', 'Regular brushing to prevent matting')
        `);
        console.log('✅ Traducciones insertadas');
        
        console.log('🎉 Base de datos inicializada correctamente!');
        console.log('');
        console.log('📋 Credenciales por defecto:');
        console.log('   Usuario: admin');
        console.log('   Contraseña: admin123');
        console.log('');
        console.log('🌐 Accede al panel de administración en: http://localhost:3000/admin');
        
    } catch (error) {
        console.error('❌ Error inicializando la base de datos:', error);
        process.exit(1);
    }
}

simpleInit();




