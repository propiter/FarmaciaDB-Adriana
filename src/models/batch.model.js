const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Batch extends Model {
    static associate(models) {
      this.belongsTo(models.Product, {
        foreignKey: 'producto_id',
        as: 'producto'
      });
      
      this.hasMany(models.SaleDetail, {
        foreignKey: 'lote_id',
        as: 'venta'
      });
      
      this.hasMany(models.ReceivingDetail, {
        foreignKey: 'lote_id',
        as: 'recepcion'
      });
      
      this.hasMany(models.SaleDetail, {
        foreignKey: 'lote_id',
        as: 'ventas'
      });
    }
  }

  Batch.init({
    lote_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    lote_codigo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    producto_id: DataTypes.INTEGER,
    fecha_vencimiento: DataTypes.DATE,
    cantidad_disponible: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    precio_compra: DataTypes.DECIMAL(10,2),
    observaciones: DataTypes.TEXT,
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Batch',
    tableName: 'lotes',
    timestamps: true,    
    createdAt: 'fecha_ingreso',
    updatedAt: 'fecha_actualizacion',
  });

  return Batch;
};
