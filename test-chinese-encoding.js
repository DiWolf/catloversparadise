// Script simple para probar la codificación de caracteres chinos
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testChineseEncoding() {
  let connection;
  
  try {
    console.log('🔧 Probando codificación de caracteres chinos...');
    
    // Conectar con configuración UTF-8
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8mb4',
      collation: 'utf8mb4_unicode_ci'
    });
    
    console.log('✅ Conectado a la base de datos');
    
    // Probar inserción de caracteres chinos
    console.log('📝 Insertando datos de prueba en chino...');
    await connection.execute(`
      INSERT INTO cat_translations (cat_id, language, name, description, characteristics, temperament, care) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [1, 'zh', '测试猫', '这是一只测试猫，非常可爱', '测试特征：聪明、活泼', '测试性格：友好、温顺', '测试护理：需要定期梳理']);
    
    console.log('✅ Datos insertados correctamente');
    
    // Leer los datos
    console.log('📖 Leyendo datos en chino...');
    const [rows] = await connection.execute('SELECT * FROM cat_translations WHERE language = ?', ['zh']);
    
    console.log('📊 Resultados:');
    console.log(JSON.stringify(rows, null, 2));
    
    // Verificar que no hay símbolos ???? 
    const hasQuestionMarks = JSON.stringify(rows).includes('?');
    if (hasQuestionMarks) {
      console.log('❌ ¡Problema! Se detectaron símbolos ???? en los datos');
    } else {
      console.log('✅ ¡Perfecto! Los caracteres chinos se muestran correctamente');
    }
    
    // Limpiar datos de prueba
    await connection.execute('DELETE FROM cat_translations WHERE language = ? AND name = ?', ['zh', '测试猫']);
    console.log('🧹 Datos de prueba eliminados');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testChineseEncoding();

