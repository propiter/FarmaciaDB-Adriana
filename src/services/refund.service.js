const { Sale, Refund, RefundDetail, Batch, sequelize } = require('../models');

const processRefund = async (refundData) => {
    const t = await sequelize.transaction();
    try {
      // 1. Verificar venta original
      const sale = await Sale.findByPk(refundData.venta_id, {
        include: ['detalles']
      });
  
      // 2. Crear devolución
      const refund = await Refund.create({
        ...refundData,
        usuario_id: refundData.usuario_id
      }, { transaction: t });
  
      // 3. Procesar items devueltos
      let totalRefund = 0;
      for (const item of refundData.items) {
        const saleDetail = sale.detalles.find(d => d.detalle_id === item.detalle_id);
        
        // Validaciones
        if (!saleDetail) throw new Error('Detalle de venta no encontrado');
        if (item.cantidad > (saleDetail.cantidad - saleDetail.cantidad_devuelta)) {
          throw new Error('Cantidad a devolver excede lo vendido');
        }
  
        // Crear detalle devolución
        await RefundDetail.create({
          devolucion_id: refund.devolucion_id,
          detalle_venta_id: item.detalle_id,
          cantidad_devuelta: item.cantidad,
          precio_unitario: saleDetail.precio_unitario,
          motivo: item.motivo
        }, { transaction: t });
  
        // Actualizar stock
        await Batch.increment('cantidad_disponible', {
          by: item.cantidad,
          where: { lote_codigo: saleDetail.lote },
          transaction: t
        });
  
        // Marcar como devuelto
        await SaleDetail.update({
          cantidad_devuelta: sequelize.literal(`cantidad_devuelta + ${item.cantidad}`),
          devuelto: sequelize.literal(`cantidad_devuelta + ${item.cantidad} >= cantidad`)
        }, {
          where: { detalle_id: item.detalle_id },
          transaction: t
        });
  
        totalRefund += item.cantidad * saleDetail.precio_unitario;
      }
  
      // 4. Actualizar total devolución
      await refund.update({ monto_total: totalRefund }, { transaction: t });
  
      await t.commit();
      return refund;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  };