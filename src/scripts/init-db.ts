import { testConnection, query } from '../config/database';
import fs from 'fs';
import path from 'path';

async function initializeDatabase() {
    try {
        console.log('🚀 Inicializando base de datos...');
        
        // Probar conexión
        const isConnected = await testConnection();
        if (!isConnected) {
            console.error('❌ No se pudo conectar a la base de datos');
            process.exit(1);
        }
        
        // Leer archivos de migración
        const migration1Path = path.join(process.cwd(), 'src', 'migrations', '001_create_tables.sql');
        const migration2Path = path.join(process.cwd(), 'src', 'migrations', '002_cats_data.sql');
        
        console.log('📁 Leyendo archivos de migración...');
        
        const migration1SQL = fs.readFileSync(migration1Path, 'utf8');
        const migration2SQL = fs.readFileSync(migration2Path, 'utf8');
        
        const migrationSQL = migration1SQL + '\n\n' + migration2SQL;
        
        // Dividir en statements individuales
        const statements = migrationSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        console.log(`📝 Ejecutando ${statements.length} statements...`);
        console.log('🔍 Primeros 3 statements:', statements.slice(0, 3));
        
        // Ejecutar cada statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.trim()) {
                console.log(`🔄 Ejecutando statement ${i + 1}:`, statement.substring(0, 100) + '...');
                try {
                    const result = await query(statement);
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
        
        console.log('🎉 Base de datos inicializada correctamente!');
        console.log('');
        console.log('📋 Credenciales por defecto:');
        console.log('   Usuario: admin');
        console.log('   Contraseña: admin123');
        console.log('');
        console.log('🌐 Accede al panel de administración en: http://localhost:3000/admin');
        
    } catch (error) {
        console.error('❌ Error inicializando la base de datos:', error);
        process.exit(1);
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    initializeDatabase();
}

export default initializeDatabase;
