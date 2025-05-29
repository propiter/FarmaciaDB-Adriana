const { Product, Batch, Supplier, Temperature } = require('../models');
const { Op } = require('sequelize');

const productService = {
  // Create new product
  async createProduct(productData) {
    // precio_compra ya no se recibe, porque se calcula de los lotes
    return await Product.create(productData);
  },

  // Get all products with filters
  async getAllProducts(filters = {}) {
    const where = {};
    
    if (filters.codigo_barras) where.codigo_barras = filters.codigo_barras;
    if (filters.nombre) where.nombre = { [Op.iLike]: `%${filters.nombre}%` };
    if (filters.categoria) where.categoria = filters.categoria;
    if (filters.laboratorio) where.laboratorio = filters.laboratorio;
    if (filters.estado !== undefined) where.estado = filters.estado;
    
    return await Product.findAll({
      where,
      include: [
        { model: Supplier, as: 'proveedor', attributes: ['nombre'] },
        { model: Temperature, as: 'temperatura', attributes: ['descripcion'] },
        { 
          model: Batch, 
          as: 'lotes',
          where: { estado: true },
          required: false
        }
      ],
      order: [['nombre', 'ASC']]
    });
  },

  // Get product by ID with details
  async getProductById(productId) {
    return await Product.findByPk(productId, {
      include: [
        { model: Supplier, as: 'proveedor' },
        { model: Temperature, as: 'temperatura' },
        { 
          model: Batch, 
          as: 'lotes',
          where: { estado: true },
          required: false
        }
      ]
    });
  },

  // Update product
  async updateProduct(id, updateData) {
    // precio_compra ya no se actualiza
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Producto no encontrado');
    return await product.update(updateData);
  },

  // Delete (deactivate) product
  async deleteProduct(productId) {
    const product = await Product.findByPk(productId);
    if (!product) throw new Error('Producto no encontrado');
    
    return await product.update({ estado: false });
  },

  // Update product stock based on batches
  async updateProductStock(productId) {
    const product = await Product.findByPk(productId, {
      include: [
        { 
          model: Batch, 
          as: 'lotes',
          where: { estado: true },
          required: false
        }
      ]
    });
    
    if (!product) throw new Error('Producto no encontrado');
    
    const totalStock = product.lotes.reduce(
      (sum, batch) => sum + batch.cantidad_disponible, 0
    );
    
    return await product.update({ stock: totalStock });
  }
};

module.exports = productService;
