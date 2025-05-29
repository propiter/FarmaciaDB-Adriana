const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PurchaseOrder extends Model {
    static associate(models) {
      this.belongsTo(models.Supplier, {
        foreignKey: 'proveedor_id',
        as: 'proveedores'
      });
      
      this.belongsTo(models.User, {
        foreignKey: 'usuario_id',
        as: 'usuarios'
      });
      
      this.hasMany(models.PurchaseDetail, {
        foreignKey: 'orden_id',
        as: 'ordenes'
      });
      
      this.hasMany(models.Receiving, {
        foreignKey: 'orden_id',
        as: 'recepciones'
      });
    }
  }

  PurchaseOrder.init({
    orden_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    proveedor_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_orden: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    },
    estado: {
      type: DataTypes.STRING(20),
      defaultValue: 'pendiente',
      validate: {
        isIn: [['pendiente', 'recibida', 'cancelada']]
      }
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'PurchaseOrder',
    tableName: 'ordenes_compra',
    timestamps: false
  });

  return PurchaseOrder;
};
