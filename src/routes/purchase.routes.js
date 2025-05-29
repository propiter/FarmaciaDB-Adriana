const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchase.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { check } = require('express-validator');

// Validation rules
const purchaseValidationRules = [
  check('proveedor_id').isInt().withMessage('Proveedor inválido'),
  check('detalles').isArray({ min: 1 }).withMessage('Debe incluir al menos un producto'),
  check('detalles.*.producto_id').isInt().withMessage('Producto inválido'),
  check('detalles.*.cantidad').isInt({ min: 1 }).withMessage('Cantidad inválida'),
  check('detalles.*.precio_unitario').isDecimal().withMessage('Precio inválido')
];

// Protected routes (require authentication)
router.use(authMiddleware.verifyToken);

// Admin and warehouse roles routes
router.post('/', 
  authMiddleware.checkRole(['admin', 'bodega']),
  purchaseValidationRules,
  purchaseController.createPurchaseOrder
);

router.get('/', purchaseController.getPurchaseOrders);
router.get('/:id', purchaseController.getPurchaseOrderById);

// Admin-only routes
router.put('/:id/status', 
  authMiddleware.checkRole('admin'),
  purchaseController.updatePurchaseOrderStatus
);

module.exports = router;
