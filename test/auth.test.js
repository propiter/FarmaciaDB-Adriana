const request = require('supertest');
const app = require('../src/index').app;
const { User } = require('../src/models');
const bcrypt = require('bcrypt');

describe('Auth API', () => {
  beforeAll(async () => {
    // Crear usuario de prueba
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      nombre: 'Test User',
      correo: 'test@example.com',
      contraseña: hashedPassword,
      rol: 'admin'
    });
  });

  afterAll(async () => {
    await User.destroy({ where: {} });
  });

  test('POST /auth/login - debería autenticar un usuario', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        correo: 'test@example.com',
        contraseña: 'password123'
      })
      .expect(200);
    
    expect(res.body).toHaveProperty('token');
  });

  test('POST /auth/login - debería fallar con credenciales incorrectas', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        correo: 'test@example.com',
        contraseña: 'wrongpassword'
      })
      .expect(401);
    
    expect(res.body).toHaveProperty('message');
  });
});
