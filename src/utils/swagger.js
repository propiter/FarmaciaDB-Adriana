const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Farmacia API',
      version: '1.0.0',
      description: 'API para sistema de inventario y POS de farmacia',
      contact: {
        name: 'Equipo de desarrollo',
        email: 'soporte@farmacia.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Producto: {
          type: 'object',
          properties: {
            producto_id: { type: 'integer' },
            nombre_producto: { type: 'string' },
            descripcion: { type: 'string' },
            stock: { type: 'integer' },
            precio_venta: { type: 'number', format: 'float' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', 
    swaggerUi.serve, 
    swaggerUi.setup(specs, {
      customCss: '.swagger-ui .topbar { background-color: #2d8659; }',
      customSiteTitle: 'Documentación Farmacia API'
    })
  );
};
