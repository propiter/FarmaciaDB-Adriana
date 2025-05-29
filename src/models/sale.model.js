const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });
      
      this.belongsTo(models.Client, {
        foreignKey: 'cliente_id',
        as: 'cliente',
        allowNull: true
      });
      
      this.hasMany(models.SaleDetail, {
        foreignKey: 'venta_id',
        as: 'detalles'
      });

      this.hasMany(models.Refund, {
        foreignKey: 'venta_id',
        as: 'devoluciones'
      });
    }
  }

  Sale.init({
    venta_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fecha_venta: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    descuento_total: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    impuesto_total: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    metodo_pago: {
      type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia', 'mixto'),
      allowNull: false
    },
    // Campos para pago mixto
    monto_efectivo: DataTypes.DECIMAL(12, 2),
    monto_tarjeta: DataTypes.DECIMAL(12, 2),
    monto_transferencia: DataTypes.DECIMAL(12, 2),
    cambio: DataTypes.DECIMAL(12, 2),
    estado: {
      type: DataTypes.ENUM('pendiente', 'completada', 'cancelada', 'parcial_devuelta', 'total_devuelta'),
      defaultValue: 'completada'
    }
  }, {
    sequelize,
    modelName: 'Sale',
    tableName: 'ventas',
    timestamps: false
  });

  return Sale;
};
