const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    static associate(models) {
      this.hasMany(models.Product, {
        foreignKey: 'proveedor_id',
        as: 'productos'
      });
      
      this.hasMany(models.PurchaseOrder, {
        foreignKey: 'proveedor_id',
        as: 'ordenesCompra'
      });
    }
  }

  Supplier.init({
    proveedor_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    contacto: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Supplier',
    tableName: 'proveedores',
    timestamps: false
  });

  return Supplier;
};
