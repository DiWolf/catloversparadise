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
        
        // Crear tabla de migraciones si no existe
        console.log('📊 Creando tabla de migraciones...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                migration_name VARCHAR(255) NOT NULL UNIQUE,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabla de migraciones creada/verificada');
        
        // Leer archivos de migración desde la carpeta de migraciones compilada
        const migration1Path = path.join(__dirname, '..', 'migrations', '001_create_tables.sql');
        const migration2Path = path.join(__dirname, '..', 'migrations', '002_cats_data.sql');
        const migration3Path = path.join(__dirname, '..', 'migrations', '003_create_cat_listings.sql');
        const migration4Path = path.join(__dirname, '..', 'migrations', '004_fix_utf8_encoding.sql');
        const migration5Path = path.join(__dirname, '..', 'migrations', '005_add_british_shorthair.sql');
        const migration6Path = path.join(__dirname, '..', 'migrations', '006_add_likoi.sql');
        
        console.log('📁 Leyendo archivos de migración...');
        console.log('📁 Ruta migración 1:', migration1Path);
        console.log('📁 Ruta migración 2:', migration2Path);
        console.log('📁 Ruta migración 3:', migration3Path);
        console.log('📁 Ruta migración 4:', migration4Path);
        console.log('📁 Ruta migración 5:', migration5Path);
        console.log('📁 Ruta migración 6:', migration6Path);
        
        const migration1SQL = fs.readFileSync(migration1Path, 'utf8');
        const migration2SQL = fs.readFileSync(migration2Path, 'utf8');
        const migration3SQL = fs.readFileSync(migration3Path, 'utf8');
        const migration4SQL = fs.readFileSync(migration4Path, 'utf8');
        const migration5SQL = fs.readFileSync(migration5Path, 'utf8');
        const migration6SQL = fs.readFileSync(migration6Path, 'utf8');
        
        const migrationSQL = migration1SQL + '\n\n' + migration2SQL + '\n\n' + migration3SQL + '\n\n' + migration4SQL + '\n\n' + migration5SQL + '\n\n' + migration6SQL;
        
        // Verificar qué migraciones ya se ejecutaron
        console.log('🔍 Verificando migraciones ejecutadas...');
        const [executedMigrations] = await connection.execute('SELECT migration_name FROM migrations');
        const executedNames = (executedMigrations as any[]).map(m => m.migration_name);
        console.log('✅ Migraciones ya ejecutadas:', executedNames);
        
        // Definir las migraciones disponibles
        const migrations = [
            { name: '001_create_tables', sql: migration1SQL },
            { name: '002_cats_data', sql: migration2SQL },
            { name: '003_create_cat_listings', sql: migration3SQL },
            { name: '004_fix_utf8_encoding', sql: migration4SQL },
            { name: '005_add_british_shorthair', sql: migration5SQL },
            { name: '006_add_likoi', sql: migration6SQL }
        ];
        
        // Ejecutar solo las migraciones pendientes
        for (const migration of migrations) {
            if (executedNames.includes(migration.name)) {
                console.log(`⏭️  Migración ${migration.name} ya ejecutada, saltando...`);
                continue;
            }
            
            console.log(`🔄 Ejecutando migración ${migration.name}...`);
            
            // Dividir en statements individuales
            const statements = migration.sql
                .replace(/--.*$/gm, '') // Eliminar comentarios de línea
                .split(';')
                .map(stmt => stmt.trim())
                .filter(stmt => stmt.length > 0 && !stmt.match(/^\s*$/));
            
            // Ejecutar cada statement de la migración
            for (let i = 0; i < statements.length; i++) {
                const statement = statements[i];
                if (statement.trim()) {
                    try {
                        await connection.execute(statement);
                        console.log(`✅ Statement ${i + 1} de ${migration.name} ejecutado`);
                    } catch (error: any) {
                        // Ignorar errores de tablas que ya existen
                        if (error.message.includes('already exists') || error.message.includes('Duplicate entry')) {
                            console.log(`⚠️  Statement ${i + 1} de ${migration.name} ignorado (ya existe)`);
                        } else {
                            console.error(`❌ Error en statement ${i + 1} de ${migration.name}:`, error.message);
                            throw error;
                        }
                    }
                }
            }
            
            // Marcar la migración como ejecutada
            await connection.execute(
                'INSERT INTO migrations (migration_name) VALUES (?)',
                [migration.name]
            );
            console.log(`✅ Migración ${migration.name} completada y marcada como ejecutada`);
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