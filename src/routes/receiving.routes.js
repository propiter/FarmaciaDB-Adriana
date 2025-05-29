const express = require('express');
const router = express.Router();
const receivingController = require('../controllers/receiving.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { check } = require('express-validator');

// Validation rules
const receivingValidationRules = [
  check('detalles').isArray({ min: 1 }).withMessage('Debe incluir al menos un producto'),
  check('detalles.*.producto_id').isInt().withMessage('Producto inválido'),
  check('detalles.*.lote_codigo').notEmpty().withMessage('Lote es requerido'),
  check('detalles.*.cantidad').isInt({ min: 1 }).withMessage('Cantidad inválida'),
  check('detalles.*.fecha_vencimiento').isDate().withMessage('Fecha inválida'),
  check('detalles.*.precio_compra').isDecimal().withMessage('Precio inválido')
];

// Protected routes (require authentication)
router.use(authMiddleware.verifyToken);

// Admin and warehouse roles routes
router.post('/', 
  authMiddleware.checkRole(['admin', 'bodega']),
  receivingValidationRules,
  receivingController.createReceiving
);

router.get('/', receivingController.getReceivings);
router.get('/:id', receivingController.getReceivingById);

// Admin-only routes
router.put('/:id/approve', 
  authMiddleware.checkRole('admin'),
  receivingController.approveReceiving
);

module.exports = router;
