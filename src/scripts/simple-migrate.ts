import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

async function runMigration() {
    let connection;
    
    try {
        console.log('🚀 Iniciando migración...');
        
        // Conectar sin especificar base de datos
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '3306'),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });
        
        console.log('✅ Conectado al servidor MySQL');
        
        // Crear base de datos
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
        console.log(`✅ Base de datos '${process.env.DB_NAME}' creada/verificada`);
        
        // Usar la base de datos
        await connection.query(`USE \`${process.env.DB_NAME}\``);
        console.log(`✅ Usando base de datos '${process.env.DB_NAME}'`);
        
        // Ejecutar SQL directamente
        console.log('📝 Creando tablas...');
        
        // Crear tabla roles
        await connection.query(`
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
        await connection.query(`
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
            )
        `);
        console.log('✅ Tabla users creada');
        
        // Crear tabla cats
        await connection.query(`
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
                created_by INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
            )
        `);
        console.log('✅ Tabla cats creada');
        
        // Crear tabla cat_translations
        await connection.query(`
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
        console.log('📝 Insertando roles...');
        await connection.query(`
            INSERT IGNORE INTO roles (name, description, permissions) VALUES 
            ('Admin', 'Administrador completo del sistema', '["all"]'),
            ('Editor', 'Editor de contenido', '["read", "write", "update"]'),
            ('Viewer', 'Solo lectura', '["read"]')
        `);
        console.log('✅ Roles insertados');
        
        // Insertar usuario admin
        console.log('📝 Insertando usuario admin...');
        await connection.query(`
            INSERT IGNORE INTO users (username, email, password_hash, first_name, last_name, role_id) VALUES 
            ('admin', 'admin@catloversparadise.com', '$2b$10$rQZ8K9vX3mN2pL1sT5uH.OVq7wE9xR4cF6gH8iJ0kL2mN4pQ6sT8uV0wX2yZ4', 'Admin', 'User', 1)
        `);
        console.log('✅ Usuario admin insertado');
        
        // Insertar gatos
        console.log('📝 Insertando gatos...');
        await connection.query(`
            INSERT IGNORE INTO cats (name, breed, slug, description, characteristics, temperament, care, hero_image, main_image, created_by) VALUES 
            ('Persian', 'persian', 'persian', 'The Persian is the most popular long-haired cat breed in the world. With its flat face, large eyes and exuberant coat, it\\'s synonymous with elegance and feline sophistication.', 'Characteristics: Flat face, large and round eyes, long and silky coat, robust body, short legs.', 'Temperament: Calm, affectionate, relaxed, independent and perfect for indoor living.', 'Care: Daily brushing, regular facial cleaning, monthly bath and frequent dental brushing.', 'persian-hero.jpg', 'persian-main.png', 1),
            ('Bengal', 'bengal', 'bengal', 'The Bengal is an exceptional breed that combines the wild elegance of the Asian leopard with domestic temperament. With its distinctive spotted coat and active personality, it\\'s perfect for families looking for an intelligent and energetic cat.', 'Characteristics: Spotted coat, green or golden eyes, athletic and muscular body, hind legs longer than front legs.', 'Temperament: Active, intelligent, curious, social and playful. Needs regular mental and physical stimulation.', 'Care: Weekly brushing, daily exercise, interactive toys and a protein-rich diet.', 'bengal-hero.jpg', 'bengal-main.png', 1),
            ('Maine Coon', 'mainecoon', 'mainecoon', 'The Maine Coon is known as the \\'gentle giant\\' of the feline world. With its imposing size and majestic coat, it\\'s one of the largest and most affectionate breeds that exist.', 'Characteristics: Large size (up to 12 kg), long and dense coat, fluffy tail, ear tufts and large paws.', 'Temperament: Gentle, affectionate, intelligent, sociable and patient. Excellent with children and other pets.', 'Care: Daily brushing, moderate exercise, regular dental brushing and a balanced diet.', 'mainecoon-hero.jpg', 'mainecoon-main.png', 1),
            ('Elf', 'elf', 'elf', 'The Elf is a unique and rare breed that combines the elegance of the Sphynx with the curled ears of the American Curl. Its distinctive appearance and affectionate personality make it an exceptional pet.', 'Characteristics: Hairless, ears curled backward, muscular body, large and expressive eyes, wrinkled skin.', 'Temperament: Affectionate, social, intelligent, playful and very attached to their human family.', 'Care: Weekly bath, sun protection, clothing to maintain temperature, regular ear cleaning.', 'elf-hero.jpg', 'elf-main.png', 1),
            ('Exotic', 'exotic', 'exotic', 'The Exotic Shorthair combines the calm personality of the Persian with short, easy-to-maintain coat. It\\'s perfect for those who love the Persian personality but prefer less coat maintenance.', 'Characteristics: Flat face, short and dense coat, large eyes, robust body, sweet expression.', 'Temperament: Calm, affectionate, relaxed, occasionally playful and very attached to their family.', 'Care: Brushing 2-3 times a week, regular facial cleaning, moderate exercise and balanced diet.', 'exotic-hero.jpg', 'exotic-main.png', 1),
            ('Sphynx', 'sphynx', 'sphynx', 'The Sphynx is a unique and fascinating breed known for its lack of hair. Its distinctive appearance and extroverted personality make it one of the most special and beloved breeds.', 'Characteristics: Hairless, wrinkled skin, large ears, large eyes, muscular body and warm to the touch.', 'Temperament: Extroverted, affectionate, energetic, curious and very social. Needs a lot of human attention.', 'Care: Weekly bath, sun protection, clothing to maintain temperature, regular ear and nail cleaning.', 'sphynx-hero.jpg', 'sphynx-main.png', 1)
        `);
        console.log('✅ Gatos insertados');
        
        // Insertar traducciones en español
        console.log('📝 Insertando traducciones en español...');
        await connection.query(`
            INSERT IGNORE INTO cat_translations (cat_id, language, name, description, characteristics, temperament, care) VALUES 
            (1, 'sp', 'Persa', 'El Persa es la raza de gatos de pelo largo más popular del mundo. Con su rostro plano, ojos grandes y pelaje exuberante, es sinónimo de elegancia y sofisticación felina.', 'Características: Rostro plano, ojos grandes y redondos, pelaje largo y sedoso, cuerpo robusto, patas cortas.', 'Temperamento: Tranquilo, cariñoso, relajado, independiente y perfecto para la vida en interiores.', 'Cuidados: Cepillado diario, limpieza facial regular, baño mensual y cepillado dental frecuente.'),
            (2, 'sp', 'Bengalí', 'El Bengalí es una raza excepcional que combina la elegancia salvaje del leopardo asiático con el temperamento doméstico. Con su pelaje moteado distintivo y su personalidad activa, es perfecto para familias que buscan un gato inteligente y enérgico.', 'Características: Pelaje moteado, ojos verdes o dorados, cuerpo atlético y musculoso, patas traseras más largas que las delanteras.', 'Temperamento: Activo, inteligente, curioso, social y juguetón. Necesita estimulación mental y física regular.', 'Cuidados: Cepillado semanal, ejercicio diario, juguetes interactivos y una dieta rica en proteínas.'),
            (3, 'sp', 'Maine Coon', 'El Maine Coon es conocido como el \\'gigante gentil\\' del mundo felino. Con su imponente tamaño y su pelaje majestuoso, es una de las razas más grandes y cariñosas que existen.', 'Características: Tamaño grande (hasta 12 kg), pelaje largo y denso, cola esponjosa, mechones en las orejas y patas grandes.', 'Temperamento: Gentil, cariñoso, inteligente, sociable y paciente. Excelente con niños y otras mascotas.', 'Cuidados: Cepillado diario, ejercicio moderado, cepillado dental regular y una dieta equilibrada.'),
            (4, 'sp', 'Elf', 'El Elf es una raza única y rara que combina la elegancia del Sphynx con las orejas curvadas del American Curl. Su apariencia distintiva y su personalidad afectuosa lo convierten en una mascota excepcional.', 'Características: Sin pelo, orejas curvadas hacia atrás, cuerpo musculoso, ojos grandes y expresivos, piel arrugada.', 'Temperamento: Afectuoso, social, inteligente, juguetón y muy apegado a su familia humana.', 'Cuidados: Baño semanal, protección solar, ropa para mantener temperatura, limpieza de oídos regular.'),
            (5, 'sp', 'Exótico', 'El Persa Exótico combina la personalidad tranquila del Persa con el pelaje corto y fácil de mantener. Es perfecto para quienes aman la personalidad persa pero prefieren menos mantenimiento del pelaje.', 'Características: Rostro plano, pelaje corto y denso, ojos grandes, cuerpo robusto, expresión dulce.', 'Temperamento: Tranquilo, cariñoso, relajado, juguetón ocasionalmente y muy apegado a su familia.', 'Cuidados: Cepillado 2-3 veces por semana, limpieza facial regular, ejercicio moderado y dieta equilibrada.'),
            (6, 'sp', 'Sphynx', 'El Sphynx es una raza única y fascinante conocida por su falta de pelo. Su apariencia distintiva y su personalidad extrovertida lo convierten en una de las razas más especiales y queridas.', 'Características: Sin pelo, piel arrugada, orejas grandes, ojos grandes, cuerpo musculoso y cálido al tacto.', 'Temperamento: Extrovertido, cariñoso, energético, curioso y muy social. Necesita mucha atención humana.', 'Cuidados: Baño semanal, protección solar, ropa para mantener temperatura, limpieza de oídos y uñas regular.')
        `);
        console.log('✅ Traducciones en español insertadas');
        
        // Insertar traducciones en inglés
        console.log('📝 Insertando traducciones en inglés...');
        await connection.query(`
            INSERT IGNORE INTO cat_translations (cat_id, language, name, description, characteristics, temperament, care) VALUES 
            (1, 'eng', 'Persian', 'The Persian is the most popular long-haired cat breed in the world. With its flat face, large eyes and exuberant coat, it\\'s synonymous with elegance and feline sophistication.', 'Characteristics: Flat face, large and round eyes, long and silky coat, robust body, short legs.', 'Temperament: Calm, affectionate, relaxed, independent and perfect for indoor living.', 'Care: Daily brushing, regular facial cleaning, monthly bath and frequent dental brushing.'),
            (2, 'eng', 'Bengal', 'The Bengal is an exceptional breed that combines the wild elegance of the Asian leopard with domestic temperament. With its distinctive spotted coat and active personality, it\\'s perfect for families looking for an intelligent and energetic cat.', 'Characteristics: Spotted coat, green or golden eyes, athletic and muscular body, hind legs longer than front legs.', 'Temperament: Active, intelligent, curious, social and playful. Needs regular mental and physical stimulation.', 'Care: Weekly brushing, daily exercise, interactive toys and a protein-rich diet.'),
            (3, 'eng', 'Maine Coon', 'The Maine Coon is known as the \\'gentle giant\\' of the feline world. With its imposing size and majestic coat, it\\'s one of the largest and most affectionate breeds that exist.', 'Characteristics: Large size (up to 12 kg), long and dense coat, fluffy tail, ear tufts and large paws.', 'Temperament: Gentle, affectionate, intelligent, sociable and patient. Excellent with children and other pets.', 'Care: Daily brushing, moderate exercise, regular dental brushing and a balanced diet.'),
            (4, 'eng', 'Elf', 'The Elf is a unique and rare breed that combines the elegance of the Sphynx with the curled ears of the American Curl. Its distinctive appearance and affectionate personality make it an exceptional pet.', 'Characteristics: Hairless, ears curled backward, muscular body, large and expressive eyes, wrinkled skin.', 'Temperament: Affectionate, social, intelligent, playful and very attached to their human family.', 'Care: Weekly bath, sun protection, clothing to maintain temperature, regular ear cleaning.'),
            (5, 'eng', 'Exotic', 'The Exotic Shorthair combines the calm personality of the Persian with short, easy-to-maintain coat. It\\'s perfect for those who love the Persian personality but prefer less coat maintenance.', 'Characteristics: Flat face, short and dense coat, large eyes, robust body, sweet expression.', 'Temperament: Calm, affectionate, relaxed, occasionally playful and very attached to their family.', 'Care: Brushing 2-3 times a week, regular facial cleaning, moderate exercise and balanced diet.'),
            (6, 'eng', 'Sphynx', 'The Sphynx is a unique and fascinating breed known for its lack of hair. Its distinctive appearance and extroverted personality make it one of the most special and beloved breeds.', 'Characteristics: Hairless, wrinkled skin, large ears, large eyes, muscular body and warm to the touch.', 'Temperament: Extroverted, affectionate, energetic, curious and very social. Needs a lot of human attention.', 'Care: Weekly bath, sun protection, clothing to maintain temperature, regular ear and nail cleaning.')
        `);
        console.log('✅ Traducciones en inglés insertadas');
        
        // Insertar traducciones en chino
        console.log('📝 Insertando traducciones en chino...');
        await connection.query(`
            INSERT IGNORE INTO cat_translations (cat_id, language, name, description, characteristics, temperament, care) VALUES 
            (1, 'zh', '波斯猫', '波斯猫是世界上最受欢迎的长毛猫品种。凭借其扁平的脸、大眼睛和丰富的皮毛，是优雅和猫科动物精致的代名词。', '特征：扁平脸，大而圆的眼睛，长而丝滑的皮毛，强壮的身体，短腿。', '性格：安静、深情、放松、独立，非常适合室内生活。', '护理：每日梳理，定期面部清洁，每月洗澡和频繁刷牙。'),
            (2, 'zh', '孟加拉猫', '孟加拉猫是一个特殊的品种，结合了亚洲豹的野性优雅和家猫的温顺性格。凭借其独特的斑点皮毛和活跃的个性，非常适合寻找聪明且精力充沛猫咪的家庭。', '特征：斑点皮毛，绿色或金色眼睛，运动型肌肉发达的身体，后腿比前腿长。', '性格：活跃、聪明、好奇、社交且顽皮。需要定期的心理和身体刺激。', '护理：每周梳理，日常锻炼，互动玩具和富含蛋白质的饮食。'),
            (3, 'zh', '缅因猫', '缅因猫被称为猫科动物世界的"温柔巨人"。凭借其雄伟的体型和威严的皮毛，是现存最大、最亲人的品种之一。', '特征：大尺寸（重达12公斤），长而浓密的皮毛，蓬松的尾巴，耳簇和大爪子。', '性格：温和、亲切、聪明、社交且耐心。与儿童和其他宠物相处极佳。', '护理：每日梳理，适度运动，定期刷牙和均衡饮食。'),
            (4, 'zh', '精灵猫', '精灵猫是一个独特而稀有的品种，结合了斯芬克斯猫的优雅和美国卷耳猫的卷曲耳朵。其独特的外观和深情的个性使其成为非凡的宠物。', '特征：无毛，耳朵向后卷曲，肌肉发达的身体，大而富有表现力的眼睛，皱褶皮肤。', '性格：深情、社交、聪明、顽皮且非常依恋人类家庭。', '护理：每周洗澡，防晒，穿衣服保持体温，定期清洁耳朵。'),
            (5, 'zh', '异国短毛猫', '异国短毛猫结合了波斯猫的安静性格和短而易维护的皮毛。非常适合喜欢波斯猫性格但希望减少皮毛维护的人。', '特征：扁平脸，短而浓密的皮毛，大眼睛，强壮的身体，甜美的表情。', '性格：安静、深情、放松、偶尔顽皮且非常依恋家庭。', '护理：每周梳理2-3次，定期面部清洁，适度运动和均衡饮食。'),
            (6, 'zh', '斯芬克斯猫', '斯芬克斯猫是一个独特而迷人的品种，以其无毛而闻名。其独特的外观和外向的个性使其成为最特殊和最受喜爱的品种之一。', '特征：无毛，皱褶皮肤，大耳朵，大眼睛，肌肉发达的身体，触感温暖。', '性格：外向、深情、精力充沛、好奇且非常社交。需要大量人类关注。', '护理：每周洗澡，防晒，穿衣服保持体温，定期清洁耳朵和指甲。')
        `);
        console.log('✅ Traducciones en chino insertadas');
        
        console.log('🎉 ¡Migración completada exitosamente!');
        console.log('');
        console.log('📋 Credenciales por defecto:');
        console.log('   Usuario: admin');
        console.log('   Contraseña: admin123');
        console.log('');
        console.log('🌐 Accede al panel de administración en: http://localhost:3000/admin');
        
    } catch (error) {
        console.error('❌ Error ejecutando migración:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

runMigration();




