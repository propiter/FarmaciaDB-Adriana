const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    static associate(models) {
      this.hasMany(models.Sale, {
        foreignKey: 'cliente_id',
        as: 'ventas'
      });
    }
  }

  Client.init({
    cliente_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    documento: {
      type: DataTypes.STRING(20),
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
    tipo_cliente: {
      type: DataTypes.STRING(20),
      defaultValue: 'normal',
      validate: {
        isIn: [['normal', 'frecuente', 'mayorista']]
      }
    }
  }, {
    sequelize,
    modelName: 'Client',
    tableName: 'clientes',
    timestamps: false
  });

  return Client;
};
