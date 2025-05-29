const productService = require('../services/product.service');
const { validationResult } = require('express-validator');

const productController = {
  createProduct: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { precio_compra, ...productData } = req.body;
      const product = await productService.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const products = await productService.getAllProducts({
        ...req.query,
        nombre: req.query.search // Para búsquedas por nombre
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { precio_compra, ...updateData } = req.body;
      const product = await productService.updateProduct(req.params.id, updateData);
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      await productService.deleteProduct(req.params.id);
      res.json({ message: 'Producto desactivado correctamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = productController;
