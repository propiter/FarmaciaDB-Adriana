const { PurchaseOrder, PurchaseDetail, Supplier, User, sequelize } = require('../models');

const purchaseService = {
  // Create purchase order with details
  createPurchaseOrder: async (orderData) => {
    const transaction = await sequelize.transaction();
    
    try {
      // Create order
      const order = await PurchaseOrder.create(orderData, { transaction });
      
      // Process each order detail
      for (const detail of orderData.detalles) {
        await PurchaseDetail.create({
          orden_id: order.orden_id,
          producto_id: detail.producto_id,
          cantidad: detail.cantidad,
          precio_unitario: detail.precio_unitario
        }, { transaction });
      }
      
      await transaction.commit();
      
      // Return order with details
      return await PurchaseOrder.findByPk(order.orden_id, {
        include: [
          { model: Supplier, as: 'proveedores', attributes: ['nombre'] },
          { model: User, as: 'usuarios', attributes: ['nombre'] },
          { 
            model: PurchaseDetail, 
            as: 'ordenes',
            include: [
              { model: Product, as: 'producto', attributes: ['nombre'] }
            ]
          }
        ]
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  // Get purchase order by ID
  getPurchaseOrderById: async (orderId) => {
    return await PurchaseOrder.findByPk(orderId, {
      include: [
        { model: Supplier, as: 'proveedores' },
        { model: User, as: 'usuario' },
        { 
          model: PurchaseDetail, 
          as: 'detalles',
          include: [
            { model: Product, as: 'producto' }
          ]
        },
        { 
          model: Receiving, 
          as: 'recepciones',
          include: [
            { model: ReceivingDetail, as: 'detalles' }
          ]
        }
      ]
    });
  },

  // Get all purchase orders with filters
  getPurchaseOrders: async (filters = {}) => {
    const where = {};
    if (filters.proveedor_id) where.proveedor_id = filters.proveedor_id;
    if (filters.estado) where.estado = filters.estado;
    
    return await PurchaseOrder.findAll({
      where,
      include: [
        { model: Supplier, as: 'proveedores', attributes: ['nombre'] },
        { model: User, as: 'usuario', attributes: ['nombre'] },
        { 
          model: PurchaseDetail, 
          as: 'ordenes',
          attributes: ['cantidad', 'precio_unitario']
        }
      ],
      order: [['fecha_orden', 'DESC']]
    });
  },

  // Update purchase order status
  updatePurchaseOrderStatus: async (orderId, newStatus) => {
    const order = await PurchaseOrder.findByPk(orderId);
    if (!order) throw new Error('Orden no encontrada');
    
    return await order.update({ estado: newStatus });
  }
};

module.exports = purchaseService;
