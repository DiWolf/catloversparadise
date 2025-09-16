import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function runProductionMigration() {
    let connection;
    
    try {
        console.log('🚀 Ejecutando migración de producción...');
        
        // Conectar sin especificar base de datos para poder crearla
        console.log('🔌 Conectando al servidor MySQL...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '3306'),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });
        
        console.log('✅ Conectado al servidor MySQL');
        
        // Crear la base de datos si no existe
        console.log('📊 Creando base de datos si no existe...');
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
        console.log(`✅ Base de datos '${process.env.DB_NAME}' creada/verificada`);
        
        // Seleccionar la base de datos
        await connection.query(`USE \`${process.env.DB_NAME}\``);
        console.log(`✅ Usando base de datos '${process.env.DB_NAME}'`);
        
        // Leer archivos de migración desde la carpeta de migraciones compilada
        const migration1Path = path.join(__dirname, '..', 'migrations', '001_create_tables.sql');
        const migration2Path = path.join(__dirname, '..', 'migrations', '002_cats_data.sql');
        const migration3Path = path.join(__dirname, '..', 'migrations', '003_create_cat_listings.sql');
        
        console.log('📁 Leyendo archivos de migración...');
        console.log('📁 Ruta migración 1:', migration1Path);
        console.log('📁 Ruta migración 2:', migration2Path);
        console.log('📁 Ruta migración 3:', migration3Path);
        
        const migration1SQL = fs.readFileSync(migration1Path, 'utf8');
        const migration2SQL = fs.readFileSync(migration2Path, 'utf8');
        const migration3SQL = fs.readFileSync(migration3Path, 'utf8');
        
        const migrationSQL = migration1SQL + '\n\n' + migration2SQL + '\n\n' + migration3SQL;
        
        // Dividir en statements individuales - método más simple
        const statements = migrationSQL
            .replace(/--.*$/gm, '') // Eliminar comentarios de línea
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.match(/^\s*$/));
        
        console.log(`📝 Ejecutando ${statements.length} statements en producción...`);
        console.log('🔍 Primeros 3 statements:', statements.slice(0, 3).map(s => s.substring(0, 100) + '...'));
        
        // Ejecutar cada statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.trim()) {
                console.log(`🔄 Ejecutando statement ${i + 1}:`, statement.substring(0, 100) + '...');
                try {
                    await connection.execute(statement);
                    console.log(`✅ Statement ${i + 1} ejecutado correctamente`);
                } catch (error: any) {
                    // Ignorar errores de tablas que ya existen
                    if (error.message.includes('already exists') || error.message.includes('Duplicate entry')) {
                        console.log(`⚠️  Statement ${i + 1} ignorado (ya existe)`);
                    } else {
                        console.error(`❌ Error en statement ${i + 1}:`, error.message);
                        console.error(`❌ Statement completo:`, statement);
                        throw error; // En producción, parar si hay errores críticos
                    }
                }
            }
        }
        
        console.log('🎉 Migración de producción completada correctamente!');
        
    } catch (error) {
        console.error('❌ Error ejecutando migración de producción:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    runProductionMigration();
}

export default runProductionMigration;