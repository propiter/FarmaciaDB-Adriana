const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Temperature extends Model {
    static associate(models) {
      // Relación definida en Product
    }
  }

  Temperature.init({
    temperatura_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    descripcion: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    rango_temperatura: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Temperature',
    tableName: 'temperaturas',
    timestamps: false
  });

  return Temperature;
};
