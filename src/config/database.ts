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
  reconnect: true,
  // Configuración UTF-8 para caracteres chinos
  charset: 'utf8mb4',
  collation: 'utf8mb4_unicode_ci',
  // Configuración adicional para MySQL
  supportBigNumbers: true,
  bigNumberStrings: true,
  dateStrings: false,
  debug: false,
  trace: false,
  // Configuración de timeouts
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000,
  // Configuración de charset específica
  typeCast: function (field: any, next: any) {
    if (field.type === 'VAR_STRING' || field.type === 'STRING' || field.type === 'TEXT') {
      return field.string();
    }
    return next();
  }
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




