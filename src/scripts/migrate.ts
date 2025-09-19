import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function runMigration() {
    let connection;
    
    try {
        console.log('🚀 Ejecutando migración...');
        
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
        
        // Leer archivos de migración
        const migration1Path = path.join(process.cwd(), 'src', 'migrations', '001_create_tables.sql');
        const migration2Path = path.join(process.cwd(), 'src', 'migrations', '002_cats_data.sql');
        const migration3Path = path.join(process.cwd(), 'src', 'migrations', '003_create_cat_listings.sql');
        const migration4Path = path.join(process.cwd(), 'src', 'migrations', '004_fix_utf8_encoding.sql');
        const migration5Path = path.join(process.cwd(), 'src', 'migrations', '005_add_british_shorthair.sql');
        const migration6Path = path.join(process.cwd(), 'src', 'migrations', '006_add_likoi.sql');
        
        console.log('📁 Leyendo archivos de migración...');
        
        const migration1SQL = fs.readFileSync(migration1Path, 'utf8');
        const migration2SQL = fs.readFileSync(migration2Path, 'utf8');
        const migration3SQL = fs.readFileSync(migration3Path, 'utf8');
        const migration4SQL = fs.readFileSync(migration4Path, 'utf8');
        const migration5SQL = fs.readFileSync(migration5Path, 'utf8');
        const migration6SQL = fs.readFileSync(migration6Path, 'utf8');
        
        const migrationSQL = migration1SQL + '\n\n' + migration2SQL + '\n\n' + migration3SQL + '\n\n' + migration4SQL + '\n\n' + migration5SQL + '\n\n' + migration6SQL;
        
        // Dividir en statements individuales - método más simple
        const statements = migrationSQL
            .replace(/--.*$/gm, '') // Eliminar comentarios de línea
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.match(/^\s*$/));
        
        console.log(`📝 Ejecutando ${statements.length} statements...`);
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
                    }
                }
            }
        }
        
        console.log('🎉 Migración completada correctamente!');
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

// Ejecutar si es llamado directamente
if (require.main === module) {
    runMigration();
}

export default runMigration;
