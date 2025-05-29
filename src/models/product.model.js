const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Product extends Model {
    static associate(models) {
      this.belongsTo(models.Supplier, {
        foreignKey: 'proveedor_id',
        as: 'proveedor'
      });
      
      this.belongsTo(models.Temperature, {
        foreignKey: 'temperatura_id',
        as: 'temperatura'
      });
      
      this.hasMany(models.Batch, {
        foreignKey: 'producto_id',
        as: 'lotes'
      });
      
      this.hasMany(models.Price, {
        foreignKey: 'producto_id',
        as: 'precio'
      });
    }
  }

  Product.init({
    producto_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigo_barras: {
      type: DataTypes.STRING(50),
      unique: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    concentracion: DataTypes.STRING(50),
    forma_farmaceutica: DataTypes.STRING(50),
    presentacion: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    laboratorio: DataTypes.STRING(100),
    registro_sanitario: DataTypes.STRING(50),
    categoria: DataTypes.STRING(50),
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    precio_venta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'productos',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
    hooks: {
      afterFind: async (products) => {
        if (!Array.isArray(products)) products = [products];
        
        for (const product of products) {
          // Calcular PPP dinámicamente
          const ppp = await sequelize.query(
            `SELECT calcular_ppp(:productId) as ppp`,
            { replacements: { productId: product.producto_id } }
          );
          product.dataValues.precio_compra = ppp[0][0].ppp;
        }
      }
    }
  });

  return Product;
};
