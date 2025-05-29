require('dotenv').config();
const { Sequelize } = require('sequelize');

if (!process.env.DB_PASSWORD) {
  throw new Error('DB_PASSWORD no está definida en .env');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true
  },
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false // Necesario para algunos servicios en la nube
    } : false
  }
});

// Verificar conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida');
  } catch (error) {
    console.error('❌ Error al conectar a PostgreSQL:', error.message);
    process.exit(1);
  }
})();

module.exports = sequelize, Sequelize;
