const request = require('supertest');
const app = require('../src/index');
const { Sale, Product, Batch, Client } = require('../src/models');

let authToken;

beforeAll(async () => {
  // Datos de prueba
  await Product.create({
    producto_id: 1,
    nombre_producto: 'Test Product',
    stock: 100,
    precio_venta: 19.99
  });
  
  await Batch.create({
    lote_id: 'LOTE-001',
    producto_id: 1,
    cantidad_disponible: 100,
    fecha_vencimiento: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 año
  });
  
  await Client.create({
    cliente_id: 1,
    nombre: 'Test Client'
  });
  
  // Obtener token
  const res = await request(app)
    .post('/api/auth/login')
    .send({ correo: 'test@example.com', password: 'password123' });
  
  authToken = res.body.token;
});

describe('Sales API', () => {
  test('POST /api/ventas - should create a sale', async () => {
    const saleData = {
      cliente_id: 1,
      detalles: [
        {
          producto_id: 1,
          lote_id: 'LOTE-001',
          cantidad: 2,
          precio_unitario: 19.99
        }
      ]
    };

    const res = await request(app)
      .post('/api/ventas')
      .set('Authorization', `Bearer ${authToken}`)
      .send(saleData);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('venta_id');
  });

  test('GET /api/ventas - should get sales', async () => {
    const res = await request(app)
      .get('/api/ventas')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
