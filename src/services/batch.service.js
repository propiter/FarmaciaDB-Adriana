const { Product, Batch, sequelize } = require('../models');
const productService = require('./product.service');
const { Op } = require('sequelize');


const batchService = {
  // Create new batch
  createOrUpdateBatch: async (batchData, transaction) => {
    const productExists = await Product.findByPk(batchData.producto_id, { transaction });
    if (!productExists) {
      throw new Error(`El producto con ID ${batchData.producto_id} no existe`);
    }
    
    const existingBatch = await Batch.findOne({
      where: {
        lote_codigo: batchData.lote_codigo,
        producto_id: batchData.producto_id
      },
      transaction
    });
    if (existingBatch) {
      await existingBatch.update({
        cantidad_disponible: sequelize.literal(`cantidad_disponible + ${batchData.cantidad}`),
        precio_compra: batchData.precio_compra,
        fecha_vencimiento: batchData.fecha_vencimiento,
        estado: true,
        fecha_actualizacion: new Date()
      }, { transaction });
      await existingBatch.reload({ transaction });
      await productService.updateProductStock(existingBatch.producto_id);

      return existingBatch;
    }
    
    const newBatch = await Batch.create({
      ...batchData,
      estado: true,
      fecha_ingreso: new Date(),
      fecha_actualizacion: new Date()
    }, { transaction });
    
    await productService.updateProductStock(newBatch.producto_id);
    
    return newBatch;
  },
  

  // Get all batches for a product
  getBatchesByProduct: async (productId) => {
    return await Batch.findAll({
      where: { producto_id: productId },
      include: [
        { model: Product, as: 'producto', attributes: ['nombre'] }
      ],
      order: [['fecha_vencimiento', 'ASC']]
    });
  },

  // Get batch by ID
  getBatchById: async (batchId) => {
    return await Batch.findByPk(batchId, {
      include: [
        { model: Product, as: 'producto' }
      ]
    });
  },

  // Update batch
  updateBatch: async (batchId, updateData) => {
    const batch = await Batch.findByPk(batchId);
    if (!batch) throw new Error('Lote no encontrado');
    
    const updatedBatch = await batch.update(updateData);
    
    // Update product stock if quantity changed
    if (updateData.cantidad !== undefined) {
      await productService.updateProductStock(batch.producto_id);
    }
    
    return updatedBatch;
  },

  // Delete (deactivate) batch
  deleteBatch: async (batchId) => {
    const batch = await Batch.findByPk(batchId);
    if (!batch) throw new Error('Lote no encontrado');
    
    await batch.update({ estado: false });
    
    // Update product stock
    await productService.updateProductStock(batch.producto_id);
    
    return { message: 'Lote desactivado correctamente' };
  },

  // Get batches expiring soon (for alerts)
  getExpiringBatches: async (daysThreshold = 30) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + daysThreshold);
    
    return await Batch.findAll({
      where: {
        estado: true,
        fecha_vencimiento: {
          [Op.lte]: expirationDate,
          [Op.gte]: new Date()
        }
      },
      include: [
        { model: Product, as: 'producto', attributes: ['nombre'] }
      ],
      order: [['fecha_vencimiento', 'ASC']]
    });
  }
};

module.exports = batchService;
