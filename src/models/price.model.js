const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Price extends Model {
    static associate(models) {
      this.belongsTo(models.Product, {
        foreignKey: 'producto_id',
        as: 'productos'
      });
    }
  }

  Price.init({
    precio_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    presentacion: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    equivalencia: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    precio_venta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Price',
    tableName: 'precios',
    timestamps: false
  });

  return Price;
};
