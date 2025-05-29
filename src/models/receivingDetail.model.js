const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  class ReceivingDetail extends Model {
    static associate(models) {
      this.belongsTo(models.Receiving, {
        foreignKey: 'recepcion_id',
        as: 'recepcion'
      });
      
      this.belongsTo(models.Product, {
        foreignKey: 'producto_id',
        as: 'producto'
      });
      
      this.belongsTo(models.Batch, {
        foreignKey: 'lote_id',
        as: 'lote'
      });
    }
  }

  ReceivingDetail.init({
    detalle_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    recepcion_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lote_codigo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    cantidad_recibida: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'ReceivingDetail',
    tableName: 'DetalleRecepcion',
    timestamps: false
  });

  return ReceivingDetail;
};
