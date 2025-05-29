const saleService = require('../services/sale.service');
const { validationResult } = require('express-validator');

const saleController = {
  createSale: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      // Add user ID from auth token
      const saleData = {
        ...req.body,
        usuario_id: req.user.usuario_id
      };
      
      const sale = await saleService.createSale(saleData);
      res.status(201).json(sale);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getSaleById: async (req, res) => {
    try {
      const sale = await saleService.getSaleById(req.params.id);
      if (!sale) {
        return res.status(404).json({ message: 'Venta no encontrada' });
      }
      res.json(sale);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getSales: async (req, res) => {
    try {
      const sales = await saleService.getSales(req.query);
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  cancelSale: async (req, res) => {
    try {
      const sale = await saleService.cancelSale(req.params.id);
      res.json({ message: 'Venta cancelada correctamente', sale });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = saleController;
