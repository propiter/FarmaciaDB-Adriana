const { Sale, SaleDetail, Batch, User, Product, sequelize, DataTypes } = require('../models');
const batchService = require('./batch.service');
const configService = require('./config.service');
const Op = sequelize.Op;

const saleService = {
  // Create a new sale with transaction
  createSale: async (saleData) => {
    const transaction = await sequelize.transaction();
    
    try {
      // Validar cliente si existe
      if (saleData.cliente_id) {
        const cliente = await sequelize.models.Client.findByPk(saleData.cliente_id, { transaction });
        if (!cliente) throw new Error('Cliente no encontrado');
      }

      // Validar y procesar lotes
      const detallesCompletos = await Promise.all(saleData.detalles.map(async detalle => {
        const lote = await Batch.findOne({
          where: { lote_codigo: detalle.lote },
          include: [{ model: Product, as: 'producto' }]
        });

        if (!lote) throw new Error(`Lote ${detalle.lote} no encontrado`);
        if (lote.cantidad_disponible < detalle.cantidad) {
          throw new Error(`Stock insuficiente para lote ${detalle.lote}`);
        }

        const impuesto = (lote.producto.precio_venta * detalle.cantidad) * (await configService.getIVA() / 100);

        return {
          producto_id: lote.producto_id,
          lote_id: lote.lote_id,
          cantidad: detalle.cantidad,
          precio_unitario: lote.producto.precio_venta,
          descuento: detalle.descuento || 0,
          impuesto
        };
      }));

      // Calcular totales
      const subtotal = detallesCompletos.reduce((sum, detalle) => sum + detalle.precio_unitario * detalle.cantidad, 0);
      const descuentoTotal = detallesCompletos.reduce((sum, detalle) => sum + detalle.descuento, 0);
      const impuestoTotal = detallesCompletos.reduce((sum, detalle) => sum + detalle.impuesto, 0);
      const total = subtotal - descuentoTotal + impuestoTotal;

      // Validar método de pago
      if (saleData.metodo_pago === 'mixto') {
        const { efectivo = 0, tarjeta = 0, transferencia = 0 } = saleData.pago_desglose || {};
        const sumaPagos = parseFloat(efectivo) + parseFloat(tarjeta) + parseFloat(transferencia);
        
        if (sumaPagos < total - 0.10) {
          throw new Error(`Los pagos (${sumaPagos}) no cubren el total (${total})`);
        }
      }

      // Crear venta
      const montoEfectivo = saleData.pago_desglose?.efectivo || 0;
      const sale = await Sale.create({
        usuario_id: saleData.usuario_id,
        cliente_id: saleData.cliente_id,
        subtotal,
        descuento_total: descuentoTotal,
        impuesto_total: impuestoTotal,
        total,
        metodo_pago: saleData.metodo_pago,
        monto_efectivo: montoEfectivo,
        monto_tarjeta: saleData.pago_desglose?.tarjeta || 0,
        monto_transferencia: saleData.pago_desglose?.transferencia || 0,
        cambio: Math.max(0, (montoEfectivo + (saleData.pago_desglose?.tarjeta || 0) + (saleData.pago_desglose?.transferencia || 0)) - total)
      }, { transaction });

      // Crear detalles de venta y actualizar inventario
      for (const detalle of detallesCompletos) {
        const subtotalLinea = detalle.precio_unitario * detalle.cantidad;
        const totalLinea = subtotalLinea - detalle.descuento + detalle.impuesto;

        await SaleDetail.create({
          venta_id: sale.venta_id,
          producto_id: detalle.producto_id,
          lote_id: detalle.lote_id,
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario,
          subtotal: subtotalLinea,
          descuento: detalle.descuento,
          impuesto: detalle.impuesto,
          total_linea: totalLinea,
          devuelto: false,
          cantidad_devuelta: 0
        }, { transaction });

        await Batch.decrement('cantidad_disponible', {
          by: detalle.cantidad,
          where: { lote_id: detalle.lote_id },
          transaction
        });
      }

      await transaction.commit();
      
      return await Sale.findByPk(sale.venta_id, {
        include: [
          { model: User, as: 'usuario', attributes: ['nombre'] },
          { 
            model: SaleDetail, 
            as: 'detalles',
            include: [
              { model: Product, as: 'producto', attributes: ['nombre'] },
              { model: Batch, as: 'lote', attributes: ['lote_codigo'] }
            ]
          }
        ]
      });
    } catch (error) {
      if (transaction.finished !== 'commit') {
        await transaction.rollback();
      }
      console.error('[ERROR] En createSale:', error.message);
      throw error;
    }
  },

  // Get sale by ID
  getSaleById: async (saleId) => {
    return await Sale.findByPk(saleId, {
      include: [
        { model: User, as: 'usuario', attributes: ['nombre'] },
        { 
          model: SaleDetail, 
          as: 'detalles',
          include: [
            { 
              model: Batch, 
              as: 'lote',
              include: [
                { model: Product, as: 'producto', attributes: ['nombre'] }
              ]
            }
          ]
        }
      ]
    });
  },

  // Get sales with filters
  getSales: async (filters = {}) => {
    const where = {};
    if (filters.usuario_id) where.usuario_id = filters.usuario_id;
    if (filters.fecha_inicio && filters.fecha_fin) {
      where.fecha_venta = {
        [Op.between]: [filters.fecha_inicio, filters.fecha_fin]
      };
    }
    
    return await Sale.findAll({
      where,
      include: [
        { model: User, as: 'usuario', attributes: ['nombre'] },
        { 
          model: SaleDetail, 
          as: 'detalles',
          attributes: ['cantidad', 'precio_unitario', 'subtotal']
        }
      ],
      order: [['fecha_venta', 'DESC']]
    });
  },

  // Cancel sale (reverse inventory)
  cancelSale: async (saleId) => {
    const transaction = await sequelize.transaction();
    
    try {
      const sale = await Sale.findByPk(saleId, {
        include: [{ model: SaleDetail, as: 'detalles' }],
        transaction
      });
      
      if (!sale) throw new Error('Venta no encontrada');
      if (sale.estado === 'cancelada') throw new Error('Venta ya está cancelada');
      
      // Process each sale detail to reverse inventory
      for (const detail of sale.detalles) {
        const batch = await Batch.findByPk(detail.lote_id, { transaction });
        if (batch) {
          await batch.update({
            cantidad_disponible: batch.cantidad_disponible + detail.cantidad
          }, { transaction });
        }
      }
      
      // Update sale status
      await sale.update({ estado: 'cancelada' }, { transaction });
      
      await transaction.commit();
      return sale;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

module.exports = saleService;
