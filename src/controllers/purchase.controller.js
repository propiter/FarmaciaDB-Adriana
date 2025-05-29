const purchaseService = require('../services/purchase.service');
const { validationResult } = require('express-validator');

const purchaseController = {
  createPurchaseOrder: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      // Add user ID from auth token
      const orderData = {
        ...req.body,
        usuario_id: req.user.usuario_id
      };
      
      const order = await purchaseService.createPurchaseOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPurchaseOrderById: async (req, res) => {
    try {
      const order = await purchaseService.getPurchaseOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Orden no encontrada' });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getPurchaseOrders: async (req, res) => {
    try {
      const orders = await purchaseService.getPurchaseOrders(req.query);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updatePurchaseOrderStatus: async (req, res) => {
    try {
      const order = await purchaseService.updatePurchaseOrderStatus(
        req.params.id, 
        req.body.estado
      );
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = purchaseController;
