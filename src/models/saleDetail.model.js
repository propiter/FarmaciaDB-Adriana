const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SaleDetail extends Model {
    static associate(models) {
      this.belongsTo(models.Sale, {
        foreignKey: 'venta_id',
        as: 'venta'
      });

      this.belongsTo(models.Product, {
        foreignKey: 'producto_id',
        as: 'producto'
      });
      
      this.belongsTo(models.Batch, {
        foreignKey: 'lote_id',
        as: 'lote'
      });

      this.hasOne(models.RefundDetail, {
        foreignKey: 'detalle_venta_id',
        as: 'devolucion'
      });

    }
  }

  SaleDetail.init({
    detalle_venta_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    venta_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lote_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: false
    },
    descuento: {
      type: DataTypes.DECIMAL(5,2),
      defaultValue: 0
    },
    impuesto: {
      type: DataTypes.DECIMAL(5,2),
      defaultValue: 0
    },
    total_linea: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: false
    },
    devuelto: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    cantidad_devuelta: DataTypes.DECIMAL(10, 3)
  }, {
    sequelize,
    modelName: 'SaleDetail',
    tableName: 'detalle_venta',
    timestamps: false
  });

  return SaleDetail;
};
