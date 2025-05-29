const clientService = require('../services/client.service');
const { validationResult } = require('express-validator');

const clientController = {
  createClient: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const client = await clientService.createClient(req.body);
      res.status(201).json(client);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllClients: async (req, res) => {
    try {
      const clients = await clientService.getAllClients(req.query);
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getClientById: async (req, res) => {
    try {
      const client = await clientService.getClientById(req.params.id);
      if (!client) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateClient: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const client = await clientService.updateClient(req.params.id, req.body);
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteClient: async (req, res) => {
    try {
      await clientService.deleteClient(req.params.id);
      res.json({ message: 'Cliente desactivado correctamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = clientController;
