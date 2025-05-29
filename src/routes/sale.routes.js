const express = require('express');
const router = express.Router();
const saleController = require('../controllers/sale.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { check } = require('express-validator');

// Validation rules
const saleValidationRules = [
  check('detalles').isArray({ min: 1 }).withMessage('Debe incluir al menos un producto'),
  check('detalles.*.lote').notEmpty().withMessage('Código de lote requerido'),
  check('detalles.*.cantidad').isInt({ min: 1 }).withMessage('Cantidad inválida'),
  check('metodo_pago').isIn(['efectivo', 'tarjeta', 'transferencia', 'mixto']).withMessage('Método de pago inválido')
];

// Protected routes (require authentication)
router.use(authMiddleware.verifyToken);

// Cashier and admin routes
router.post('/', 
  authMiddleware.checkRole(['admin', 'cajero']),
  saleValidationRules,
  saleController.createSale
);

router.get('/', saleController.getSales);
router.get('/:id', saleController.getSaleById);

// Admin-only routes
router.put('/:id/cancel', 
  authMiddleware.checkRole('admin'),
  saleController.cancelSale
);

module.exports = router;
