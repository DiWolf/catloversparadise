import { query } from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

async function fixUTF8Encoding() {
  try {
    console.log('🔧 Iniciando corrección de codificación UTF-8...');

    // 1. Cambiar la base de datos a UTF-8
    console.log('📝 Configurando base de datos...');
    await query(`ALTER DATABASE \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);

    // 2. Lista de tablas que necesitan conversión
    const tables = [
      'cats',
      'cat_translations', 
      'cat_listings',
      'cat_listing_translations',
      'users',
      'roles'
    ];

    for (const table of tables) {
      try {
        console.log(`🔄 Convirtiendo tabla: ${table}`);
        
        // Convertir tabla a UTF-8
        await query(`ALTER TABLE \`${table}\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        
        // Convertir columnas de texto específicamente
        const textColumns = await query(`
          SELECT COLUMN_NAME, DATA_TYPE 
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? 
          AND (DATA_TYPE LIKE '%char%' OR DATA_TYPE LIKE '%text%')
        `, [process.env.DB_NAME, table]);

        for (const column of textColumns as any[]) {
          const columnName = column.COLUMN_NAME;
          const dataType = column.DATA_TYPE;
          
          console.log(`  📝 Convirtiendo columna: ${columnName} (${dataType})`);
          
          // Convertir columna específica
          await query(`ALTER TABLE \`${table}\` MODIFY COLUMN \`${columnName}\` ${dataType.toUpperCase()} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        }
        
        console.log(`✅ Tabla ${table} convertida exitosamente`);
      } catch (error) {
        console.log(`⚠️  Error en tabla ${table}:`, error);
        // Continuar con las demás tablas
      }
    }

    // 3. Verificar la configuración
    console.log('🔍 Verificando configuración...');
    const dbCharset = await query('SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?', [process.env.DB_NAME]);
    console.log('📊 Configuración de la base de datos:', dbCharset);

    // 4. Probar con datos chinos
    console.log('🧪 Probando con caracteres chinos...');
    try {
      // Insertar un registro de prueba
      await query('INSERT INTO cat_translations (cat_id, language, name, description, characteristics, temperament, care) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [1, 'zh', '测试猫', '这是一只测试猫', '测试特征', '测试性格', '测试护理']);
      
      // Leer el registro
      const testResult = await query('SELECT * FROM cat_translations WHERE language = ?', ['zh']);
      console.log('✅ Prueba de caracteres chinos exitosa:', testResult);
      
      // Limpiar el registro de prueba
      await query('DELETE FROM cat_translations WHERE language = ? AND name = ?', ['zh', '测试猫']);
      
    } catch (testError) {
      console.log('⚠️  Error en prueba de caracteres chinos:', testError);
    }

    console.log('🎉 ¡Corrección de codificación UTF-8 completada!');
    console.log('💡 Los caracteres chinos ahora deberían mostrarse correctamente.');

  } catch (error) {
    console.error('❌ Error durante la corrección:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  fixUTF8Encoding()
    .then(() => {
      console.log('✅ Script completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script falló:', error);
      process.exit(1);
    });
}

export default fixUTF8Encoding;
