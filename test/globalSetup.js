const { sequelize } = require('../src/config/database');

if (!sequelize) {
  console.error('❌ Error: No se pudo obtener instancia de Sequelize');
  process.exit(1);
}

module.exports = async () => {
  try {
    console.log('🔌 Verificando conexión a BD...');
    await sequelize.authenticate();
    
    console.log('🔄 Sincronizando modelos (force: true)...');
    await sequelize.sync({ force: true });
    
    console.log('✨ Setup completado exitosamente');
  } catch (error) {
    console.error('❌ Error crítico en setup:', error);
    process.exit(1);
  }
};