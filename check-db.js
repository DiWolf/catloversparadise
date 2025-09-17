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
    
    console.log('\nVerificando gatos...');
    const cats = await query('SELECT id, name, breed, slug, is_active FROM cats ORDER BY id');
    console.log('Gatos en la tabla:', cats);
    
    console.log('\nVerificando British Shorthair específicamente...');
    const britishShorthair = await query('SELECT * FROM cats WHERE breed = "british-shorthair"');
    console.log('British Shorthair:', britishShorthair);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

checkTables();




