const batchService = require('../services/batch.service');
const { validationResult } = require('express-validator');

const batchController = {
  createOrUpdateBatch: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const batch = await batchService.createOrUpdateBatch(req.body);
      res.status(201).json(batch);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getBatchesByProduct: async (req, res) => {
    try {
      const batches = await batchService.getBatchesByProduct(req.params.productId);
      res.json(batches);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getBatchById: async (req, res) => {
    try {
      const batch = await batchService.getBatchById(req.params.id);
      if (!batch) {
        return res.status(404).json({ message: 'Lote no encontrado' });
      }
      res.json(batch);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateBatch: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const batch = await batchService.updateBatch(req.params.id, req.body);
      res.json(batch);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteBatch: async (req, res) => {
    try {
      await batchService.deleteBatch(req.params.id);
      res.json({ message: 'Lote desactivado correctamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getExpiringBatches: async (req, res) => {
    try {
      const daysThreshold = parseInt(req.query.days) || 30;
      const batches = await batchService.getExpiringBatches(daysThreshold);
      res.json(batches);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = batchController;
