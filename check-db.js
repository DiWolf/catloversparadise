const { query } = require('./dist/config/database');

async function checkTables() {
  try {
    console.log('Verificando tablas...');
    const tables = await query('SHOW TABLES');
    console.log('Tablas existentes:', tables);
    
    console.log('\nVerificando usuarios...');
    const users = await query('SELECT * FROM users');
    console.log('Usuarios en la tabla:', users);
    
    console.log('\nVerificando roles...');
    const roles = await query('SELECT * FROM roles');
    console.log('Roles en la tabla:', roles);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

checkTables();




