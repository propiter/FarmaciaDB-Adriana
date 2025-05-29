const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PurchaseDetail extends Model {
    static associate(models) {
      this.belongsTo(models.PurchaseOrder, {
        foreignKey: 'orden_id',
        as: 'orden'
      });
      
      this.belongsTo(models.Product, {
        foreignKey: 'producto_id',
        as: 'producto'
      });
    }
  }

  PurchaseDetail.init({
    detalle_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orden_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    producto_id: {
      type: DataTypes.INTEGER,
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
    modelName: 'PurchaseDetail',
    tableName: 'detalle_orden_compra',
    timestamps: false
  });

  return PurchaseDetail;
};
