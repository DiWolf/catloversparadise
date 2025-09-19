-- Migración 006: Agregar Likoi
-- Ejecutar: npm run migrate

-- Insertar Likoi en la tabla cats
INSERT INTO cats (name, breed, slug, description, characteristics, temperament, care, hero_image, main_image, is_active, created_by) VALUES 
('Likoi', 'likoi', 'likoi', 'The Likoi is a rare and unique cat breed known for its distinctive patchy fur that gives it a wild, werewolf-like appearance. Originating from Hawaii, it\'s a relatively new breed with a fascinating look.', 'Characteristics: Patchy fur resembling a werewolf, large ears, muscular build, amber eyes, and a distinctive appearance.', 'Temperament: Affectionate, playful, intelligent, and social. They form strong bonds with their owners.', 'Care: Regular grooming to manage the patchy fur, moderate exercise, and a balanced diet.', 'breeds/likoi-hero.png', 'breeds/likoi-main.jpg', TRUE, 1);

-- Insertar traducciones en español
INSERT INTO cat_translations (cat_id, language, name, description, characteristics, temperament, care) VALUES 
(LAST_INSERT_ID(), 'sp', 'Likoi', 'El Likoi es una raza de gato rara y única conocida por su pelaje moteado que le da una apariencia salvaje, similar a un hombre lobo. Originario de Hawái, es una raza relativamente nueva con un aspecto fascinante.', 'Características: Pelaje moteado similar a un hombre lobo, orejas grandes, cuerpo musculoso, ojos ámbar y una apariencia distintiva.', 'Temperamento: Cariñoso, juguetón, inteligente y sociable. Forman lazos fuertes con sus dueños.', 'Cuidados: Cepillado regular para manejar el pelaje moteado, ejercicio moderado y una dieta equilibrada.');

-- Insertar traducciones en inglés
INSERT INTO cat_translations (cat_id, language, name, description, characteristics, temperament, care) VALUES 
(LAST_INSERT_ID(), 'eng', 'Likoi', 'The Likoi is a rare and unique cat breed known for its distinctive patchy fur that gives it a wild, werewolf-like appearance. Originating from Hawaii, it\'s a relatively new breed with a fascinating look.', 'Characteristics: Patchy fur resembling a werewolf, large ears, muscular build, amber eyes, and a distinctive appearance.', 'Temperament: Affectionate, playful, intelligent, and social. They form strong bonds with their owners.', 'Care: Regular grooming to manage the patchy fur, moderate exercise, and a balanced diet.');

-- Insertar traducciones en chino
INSERT INTO cat_translations (cat_id, language, name, description, characteristics, temperament, care) VALUES 
(LAST_INSERT_ID(), 'zh', '利科伊猫', '利科伊猫是一种罕见而独特的猫种，以其独特的斑驳毛发而闻名，给它一种野性的狼人般的模样。起源于夏威夷，它是一个相对较新的品种，具有迷人的外观。', '特征：斑驳毛发类似于狼人，大耳朵，肌肉发达的身体，琥珀色眼睛，以及独特的模样。', '性格：深情、顽皮、聪明且社交。他们与主人形成牢固的纽带。', '护理：定期梳理以管理斑驳毛发，中等运动，以及均衡饮食。');