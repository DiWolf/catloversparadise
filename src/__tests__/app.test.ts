import request from 'supertest';
import express from 'express';

// Test básico para verificar que la aplicación funciona
describe('App', () => {
  let app: express.Application;

  beforeAll(() => {
    // Importar la aplicación después de configurar el entorno
    process.env.NODE_ENV = 'test';
    // Aquí podrías importar tu app real cuando esté lista
    app = express();
    app.get('/', (req, res) => {
      res.json({ message: 'Hello World' });
    });
  });

  it('should respond to GET /', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);
    
    expect(response.body.message).toBe('Hello World');
  });
});
