-- Migración 005: Agregar British Shorthair
-- Ejecutar: npm run migrate

-- Insertar British Shorthair en la tabla cats
INSERT INTO cats (name, breed, slug, description, characteristics, temperament, care, hero_image, main_image, is_active, created_by) VALUES 
('British Shorthair', 'british-shorthair', 'british-shorthair', 'The British Shorthair is one of the oldest and most beloved cat breeds in the world. Known for its round face, dense coat, and calm temperament, it\'s the perfect companion for families seeking a gentle and affectionate feline friend.', 'Characteristics: Round face with full cheeks, large round eyes (copper, blue, or green), dense and plush coat, muscular and compact body, short legs.', 'Temperament: Calm, gentle, affectionate, independent, and very patient. Excellent with children and other pets.', 'Care: Weekly brushing, moderate exercise, regular dental care, and a balanced diet to prevent obesity.', 'breeds/british-shorthair-hero.png', 'breeds/british-shorthair-main.jpg', TRUE, 1);

-- Insertar traducciones en español
INSERT INTO cat_translations (cat_id, language, name, description, characteristics, temperament, care) VALUES 
(7, 'sp', 'British Shorthair', 'El British Shorthair es una de las razas de gatos más antiguas y queridas del mundo. Conocido por su rostro redondo, pelaje denso y temperamento tranquilo, es el compañero perfecto para familias que buscan un amigo felino gentil y cariñoso.', 'Características: Rostro redondo con mejillas llenas, ojos grandes y redondos (cobrizos, azules o verdes), pelaje denso y esponjoso, cuerpo musculoso y compacto, patas cortas.', 'Temperamento: Tranquilo, gentil, cariñoso, independiente y muy paciente. Excelente con niños y otras mascotas.', 'Cuidados: Cepillado semanal, ejercicio moderado, cuidado dental regular y una dieta equilibrada para prevenir la obesidad.');

-- Insertar traducciones en inglés
INSERT INTO cat_translations (cat_id, language, name, description, characteristics, temperament, care) VALUES 
(7, 'eng', 'British Shorthair', 'The British Shorthair is one of the oldest and most beloved cat breeds in the world. Known for its round face, dense coat, and calm temperament, it\'s the perfect companion for families seeking a gentle and affectionate feline friend.', 'Characteristics: Round face with full cheeks, large round eyes (copper, blue, or green), dense and plush coat, muscular and compact body, short legs.', 'Temperament: Calm, gentle, affectionate, independent, and very patient. Excellent with children and other pets.', 'Care: Weekly brushing, moderate exercise, regular dental care, and a balanced diet to prevent obesity.');

-- Insertar traducciones en chino
INSERT INTO cat_translations (cat_id, language, name, description, characteristics, temperament, care) VALUES 
(7, 'zh', '英国短毛猫', '英国短毛猫是世界上最古老、最受喜爱的猫品种之一。以其圆脸、浓密毛发和安静的性格而闻名，是寻求温和、深情猫咪朋友的家庭的完美伴侣。', '特征：圆脸，脸颊丰满，大而圆的眼睛（铜色、蓝色或绿色），浓密蓬松的毛发，肌肉发达且紧凑的身体，短腿。', '性格：安静、温和、深情、独立且非常有耐心。与儿童和其他宠物相处极佳。', '护理：每周梳理，适度运动，定期牙齿护理，均衡饮食以防止肥胖。');
