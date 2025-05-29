const { Client, Sale } = require('../models');

const clientService = {
  // Create new client
  createClient: async (clientData) => {
    return await Client.create(clientData);
  },

  // Get all clients with filters
  getAllClients: async (filters = {}) => {
    const where = {};
    if (filters.tipo) where.tipo = filters.tipo;
    if (filters.estado !== undefined) where.estado = filters.estado;
    
    return await Client.findAll({
      where,
      order: [['nombre', 'ASC']]
    });
  },

  // Get client by ID with sales history
  getClientById: async (clientId) => {
    return await Client.findByPk(clientId, {
      include: [
        { 
          model: Sale, 
          as: 'ventas',
          attributes: ['venta_id', 'fecha_venta', 'total'],
          order: [['fecha_venta', 'DESC']],
          limit: 10
        }
      ]
    });
  },

  // Update client
  updateClient: async (clientId, updateData) => {
    const client = await Client.findByPk(clientId);
    if (!client) throw new Error('Cliente no encontrado');
    
    return await client.update(updateData);
  },

  // Delete (deactivate) client
  deleteClient: async (clientId) => {
    const client = await Client.findByPk(clientId);
    if (!client) throw new Error('Cliente no encontrado');
    
    return await client.update({ estado: false });
  }
};

module.exports = clientService;
