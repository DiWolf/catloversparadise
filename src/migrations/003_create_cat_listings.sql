-- Migración 003: Crear tabla de gatos en venta (cat_listings)
-- Ejecutar: npm run migrate

-- Crear tabla de gatos en venta
CREATE TABLE IF NOT EXISTS cat_listings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cat_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    age_months INT NOT NULL,
    color VARCHAR(100),
    eye_color VARCHAR(50),
    special_characteristics TEXT,
    pet_price DECIMAL(10,2),
    breeding_price DECIMAL(10,2),
    status ENUM('available', 'reserved', 'sold') DEFAULT 'available',
    images JSON,
    description TEXT,
    whatsapp_message TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cat_id) REFERENCES cats(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_cat_id (cat_id),
    INDEX idx_status (status),
    INDEX idx_gender (gender),
    INDEX idx_age (age_months),
    INDEX idx_is_active (is_active)
);

-- Crear tabla de traducciones para listings
CREATE TABLE IF NOT EXISTS cat_listing_translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    listing_id INT NOT NULL,
    language VARCHAR(5) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    special_characteristics TEXT,
    whatsapp_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES cat_listings(id) ON DELETE CASCADE,
    UNIQUE KEY unique_listing_language (listing_id, language)
);
