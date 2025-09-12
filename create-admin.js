const bcrypt = require('bcrypt');
const { query } = require('./dist/config/database');

async function createAdmin() {
  try {
    console.log('Creando usuario admin...');
    
    // Crear hash de la contraseña admin123
    const hashedPassword = await bcrypt.hash('admin123', 10);
    console.log('Contraseña encriptada:', hashedPassword);
    
    // Eliminar usuario admin existente
    await query('DELETE FROM users WHERE username = ?', ['admin']);
    console.log('Usuario admin anterior eliminado');
    
    // Crear nuevo usuario admin
    await query('INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, ?)', 
      ['admin', 'admin@catloversparadise.com', hashedPassword, 1]);
    console.log('Usuario admin creado correctamente');
    
    // Verificar que se creó
    const users = await query('SELECT * FROM users WHERE username = ?', ['admin']);
    console.log('Usuario creado:', users[0]);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

createAdmin();




