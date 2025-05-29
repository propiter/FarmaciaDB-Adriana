const { sequelize } = require('../src/config/database');

// Configuración global para las pruebas
beforeAll(async () => {
  // Sincronizar modelos con la base de datos
  await sequelize.sync({ force: true });
  
  // Datos básicos requeridos
  await sequelize.models.Temperature.bulkCreate([
    { descripcion: 'Ambiente', rango_temperatura: '15-25°C' },
    { descripcion: 'Refrigerado', rango_temperatura: '2-8°C' },
    { descripcion: 'Congelado', rango_temperatura: '-20°C' }
  ]);
});

beforeEach(async () => {
  // Limpiar datos entre pruebas
  await sequelize.truncate({ cascade: true });
  
  // Reinsertar datos básicos
  await sequelize.models.Temperature.bulkCreate([
    { descripcion: 'Ambiente', rango_temperatura: '15-25°C' },
    { descripcion: 'Refrigerado', rango_temperatura: '2-8°C' },
    { descripcion: 'Congelado', rango_temperatura: '-20°C' }
  ]);
});

afterAll(async () => {
  // No cerrar conexión aquí (se hace en globalTeardown)
});
