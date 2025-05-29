const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Receiving extends Model {
    static associate(models) {
      this.belongsTo(models.PurchaseOrder, {
        foreignKey: 'orden_id',
        as: 'orden'
      });
      
      this.belongsTo(models.User, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });
      
      this.hasMany(models.ReceivingDetail, {
        foreignKey: 'recepcion_id',
        as: 'detalles'
      });
    }
  }

  Receiving.init({
    recepcion_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orden_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_recepcion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    estado: {
      type: DataTypes.STRING(20),
      defaultValue: 'borrador',
      validate: {
        isIn: [['borrador', 'aprobada', 'cancelada']]
      }
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Receiving',
    tableName: 'recepciones',
    timestamps: false
  });

  return Receiving;
};
