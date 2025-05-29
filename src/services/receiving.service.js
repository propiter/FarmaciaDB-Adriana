const { Receiving, ReceivingDetail, Batch, PurchaseOrder, Product, sequelize } = require('../models');
const batchService = require('./batch.service');
const productService = require('./product.service');

const receivingService = {
  // Create receiving with details
  createReceiving: async (receivingData) => {
    const transaction = await sequelize.transaction();
    
    try {
      // Create receiving
      const receiving = await Receiving.create(receivingData, { transaction });
      
      // Process each receiving detail
      for (const detail of receivingData.detalles) {
        // Create batch if not exists
        let batch = await Batch.findOne({ 
          where: { lote_codigo: detail.lote_codigo || detail.lote } 
        }, { transaction });
        
        if (!batch) {
          batch = await batchService.createOrUpdateBatch({
            lote_codigo: detail.lote_codigo || detail.lote,
            producto_id: detail.producto_id,
            fecha_vencimiento: detail.fecha_vencimiento,
            cantidad_disponible: detail.cantidad,
            precio_compra: detail.precio_compra
          }, transaction);
        } else {
          // Update existing batch
          await batch.update({
            cantidad_disponible: batch.cantidad_disponible + detail.cantidad,
            precio_compra: detail.precio_compra
          }, { transaction });
        }
        
        // Create receiving detail
        await ReceivingDetail.create({
          recepcion_id: receiving.recepcion_id,
          producto_id: detail.producto_id,
          lote_codigo: detail.lote_codigo || detail.lote,
          cantidad: detail.cantidad,
          fecha_vencimiento: detail.fecha_vencimiento,
          precio_compra: detail.precio_compra,
          observaciones: detail.observaciones
        }, { transaction });
        
        // Update product stock
        await productService.updateProductStock(detail.producto_id, { transaction });
      }
      
      // Update purchase order status if linked
      if (receivingData.orden_id) {
        await PurchaseOrder.update(
          { estado: 'recibida' },
          { where: { orden_id: receivingData.orden_id }, transaction }
        );
      }
      
      await transaction.commit();
      
      // Return receiving with details
      return await Receiving.findByPk(receiving.recepcion_id, {
        include: [
          { model: PurchaseOrder, as: 'orden', attributes: ['orden_id'] },
          { model: User, as: 'usuario', attributes: ['nombre'] },
          { 
            model: ReceivingDetail, 
            as: 'detalles',
            include: [
              { model: Product, as: 'producto', attributes: ['nombre'] },
              { model: Batch, as: 'lote', attributes: ['lote_codigo'] }
            ]
          }
        ]
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  // Get receiving by ID
  getReceivingById: async (receivingId) => {
    return await Receiving.findByPk(receivingId, {
      include: [
        { model: PurchaseOrder, as: 'orden' },
        { model: User, as: 'usuario' },
        { 
          model: ReceivingDetail, 
          as: 'detalles',
          include: [
            { model: Product, as: 'producto' },
            { model: Batch, as: 'lote' }
          ]
        }
      ]
    });
  },

  // Get all receivings with filters
  getReceivings: async (filters = {}) => {
    const where = {};
    if (filters.orden_id) where.orden_id = filters.orden_id;
    if (filters.estado) where.estado = filters.estado;
    
    return await Receiving.findAll({
      where,
      include: [
        { model: PurchaseOrder, as: 'orden', attributes: ['orden_id'] },
        { model: User, as: 'usuario', attributes: ['nombre'] },
        { 
          model: ReceivingDetail, 
          as: 'detalles',
          attributes: ['cantidad', 'precio_compra'],
          include: [
            { model: Product, as: 'producto', attributes: ['nombre'] }
          ]
        }
      ],
      order: [['fecha_recepcion', 'DESC']]
    });
  },

  // Approve receiving (finalize)
  approveReceiving: async (receivingId) => {
    const receiving = await Receiving.findByPk(receivingId);
    if (!receiving) throw new Error('Recepción no encontrada');
    
    return await receiving.update({ estado: 'aprobada' });
  }
};

module.exports = receivingService;
