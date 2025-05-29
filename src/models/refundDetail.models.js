const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RefundDetail extends Model {
    static associate(models) {
      this.belongsTo(models.Refund, {
        foreignKey: 'devolucion_id',
        as: 'devolucion'
      });
      
      this.belongsTo(models.SaleDetail, {
        foreignKey: 'detalle_venta_id',
        as: 'detalle_venta'
      });
      
      this.belongsTo(models.Batch, {
        foreignKey: 'lote_id',
        as: 'lote'
      });
    }
  }

  RefundDetail.init({
    cantidad_devuelta: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    motivo: DataTypes.STRING(100)
  }, {
    sequelize,
    modelName: 'RefundDetail',
    tableName: 'detalle_devolucion'
  });

  return RefundDetail;
};