// Configuración para las pruebas
import dotenv from 'dotenv';

// Cargar variables de entorno para las pruebas
dotenv.config({ path: '.env.test' });

// Configuración global para las pruebas
beforeAll(async () => {
  // Configuración inicial antes de todas las pruebas
});

afterAll(async () => {
  // Limpieza después de todas las pruebas
});

beforeEach(() => {
  // Configuración antes de cada prueba
});

afterEach(() => {
  // Limpieza después de cada prueba
});
