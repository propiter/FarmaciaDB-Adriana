const receivingService = require('../services/receiving.service');
const { validationResult } = require('express-validator');

const receivingController = {
  createReceiving: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      // Add user ID from auth token
      const receivingData = {
        ...req.body,
        usuario_id: req.user.usuario_id
      };
      
      const receiving = await receivingService.createReceiving(receivingData);
      res.status(201).json(receiving);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getReceivingById: async (req, res) => {
    try {
      const receiving = await receivingService.getReceivingById(req.params.id);
      if (!receiving) {
        return res.status(404).json({ message: 'Recepción no encontrada' });
      }
      res.json(receiving);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getReceivings: async (req, res) => {
    try {
      const receivings = await receivingService.getReceivings(req.query);
      res.json(receivings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  approveReceiving: async (req, res) => {
    try {
      const receiving = await receivingService.approveReceiving(req.params.id);
      res.json(receiving);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = receivingController;
