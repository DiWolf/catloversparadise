-- Migración 004: Corregir codificación UTF-8 para caracteres chinos
-- Ejecutar: npm run fix-utf8

-- Configurar la base de datos para UTF-8
ALTER DATABASE catloversparadise CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Configurar tablas existentes para UTF-8
ALTER TABLE cats CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE cat_translations CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE cat_listings CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE cat_listing_translations CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE roles CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Configurar columnas de texto específicamente
-- Tabla cats
ALTER TABLE cats MODIFY COLUMN breed VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE cats MODIFY COLUMN slug VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla cat_translations
ALTER TABLE cat_translations MODIFY COLUMN language VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE cat_translations MODIFY COLUMN name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE cat_translations MODIFY COLUMN description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE cat_translations MODIFY COLUMN characteristics TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE cat_translations MODIFY COLUMN temperament TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE cat_translations MODIFY COLUMN care TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla cat_listings
ALTER TABLE cat_listings MODIFY COLUMN name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE cat_listings MODIFY COLUMN gender ENUM('male', 'female') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE cat_listings MODIFY COLUMN color VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE cat_listings MODIFY COLUMN eye_color VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE cat_listings MODIFY COLUMN special_characteristics TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE cat_listings MODIFY COLUMN status ENUM('available', 'reserved', 'sold') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE cat_listings MODIFY COLUMN description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE cat_listings MODIFY COLUMN whatsapp_message TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla cat_listing_translations
ALTER TABLE cat_listing_translations MODIFY COLUMN language VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE cat_listing_translations MODIFY COLUMN name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE cat_listing_translations MODIFY COLUMN description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla users
ALTER TABLE users MODIFY COLUMN username VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE users MODIFY COLUMN email VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE users MODIFY COLUMN first_name VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE users MODIFY COLUMN last_name VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla roles
ALTER TABLE roles MODIFY COLUMN name VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE roles MODIFY COLUMN description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verificar la configuración
SELECT 
    TABLE_NAME,
    TABLE_COLLATION,
    CHARACTER_SET_NAME
FROM INFORMATION_SCHEMA.TABLES t
JOIN INFORMATION_SCHEMA.COLLATIONS c ON t.TABLE_COLLATION = c.COLLATION_NAME
WHERE t.TABLE_SCHEMA = 'catloversparadise'
AND t.TABLE_TYPE = 'BASE TABLE';

