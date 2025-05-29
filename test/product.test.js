const request = require('supertest');
const app = require('../src/app');
const { Product, sequelize } = require('../src/models');

describe('Product API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Recrea tablas
    
    // Datos de prueba para PostgreSQL
    await Product.bulkCreate([
      {
        nombre: 'Paracetamol 500mg',
        codigo_barras: '123456789',
        presentacion: 'Tabletas',
        precio_venta: 10.50,
        stock: 100
      },
      {
        nombre: 'Ibuprofeno 400mg',
        codigo_barras: '987654321',
        presentacion: 'Cápsulas',
        precio_venta: 15.75,
        stock: 50
      }
    ]);
  });

  afterAll(async () => {
    await Product.destroy({ where: {} });
    await sequelize.close();
  });

  test('GET /products - debería retornar todos los productos', async () => {
    const res = await request(app)
      .get('/products')
      .expect(200);
    
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty('nombre', 'Paracetamol 500mg');
  });

  test('GET /products/:id - debería retornar un producto por ID', async () => {
    const product = await Product.findOne();
    const res = await request(app)
      .get(`/products/${product.producto_id}`)
      .expect(200);
    
    expect(res.body).toHaveProperty('nombre', product.nombre);
  });

  test('POST /products - debería crear un nuevo producto', async () => {
    const newProduct = {
      nombre: 'Amoxicilina 250mg',
      codigo_barras: '555555555',
      presentacion: 'Cápsulas',
      precio_venta: 20.00,
      stock: 30
    };
    
    const res = await request(app)
      .post('/products')
      .send(newProduct);
    
    expect(res.body).toHaveProperty('precio_compra'); // Ahora viene del cálculo PPP
  });
});
