const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Sale, {
        foreignKey: 'usuario_id',
        as: 'ventas'
      });
      
      this.hasMany(models.PurchaseOrder, {
        foreignKey: 'usuario_id',
        as: 'ordenesCompra'
      });
      
      this.hasMany(models.Receiving, {
        foreignKey: 'usuario_id',
        as: 'recepciones'
      });
    }
  }

  User.init({
    usuario_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    contraseña: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['admin', 'cajero', 'bodega']]
      }
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'usuarios',
    timestamps: false
  });

  return User;
};
