import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'catloversparadise',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para probar la conexión
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a la base de datos establecida');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    return false;
  }
};

// Función para ejecutar consultas
export const query = async (sql: string, params: any[] = []): Promise<any> => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Error ejecutando consulta:', error);
    throw error;
  }
};

// Función para obtener una conexión
export const getConnection = async () => {
  return await pool.getConnection();
};

export default pool;




