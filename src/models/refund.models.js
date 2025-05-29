const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Refund extends Model {
    static associate(models) {
      this.belongsTo(models.Sale, {
        foreignKey: 'venta_id',
        as: 'venta'
      });
      
      this.belongsTo(models.User, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });

      this.hasMany(models.RefundDetail, {
        foreignKey: 'devolucion_id',
        as: 'detalles'
      });
    }
  }

  Refund.init({
    devolucion_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    venta_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('parcial', 'total'),
      allowNull: false
    },
    motivo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    observaciones: DataTypes.TEXT,
    monto_total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    metodo_reembolso: {
      type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia', 'credito')
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'completada', 'rechazada'),
      defaultValue: 'pendiente'
    }
  }, {
    sequelize,
    modelName: 'Refund',
    tableName: 'devoluciones',
    timestamps: true,
    paranoid: true
  });

  return Refund;
};