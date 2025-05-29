const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batch.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { check } = require('express-validator');

// Validation rules
const batchValidationRules = [
  check('lote_id').notEmpty().withMessage('El código del lote es requerido'),
  check('producto_id').isInt().withMessage('Producto inválido'),
  check('fecha_vencimiento').isDate().withMessage('Fecha inválida'),
  check('precio_compra').isDecimal().withMessage('Precio inválido')
];

// Public routes
router.get('/product/:productId', batchController.getBatchesByProduct);
router.get('/expiring', batchController.getExpiringBatches);

// Protected routes (require authentication)
router.use(authMiddleware.verifyToken);

// Admin and warehouse roles routes
router.post('/', 
  authMiddleware.checkRole(['admin', 'bodega']),
  batchValidationRules,
  batchController.createOrUpdateBatch
);

router.put('/:id', 
  authMiddleware.checkRole(['admin', 'bodega']),
  batchValidationRules,
  batchController.updateBatch
);

router.delete('/:id', 
  authMiddleware.checkRole(['admin', 'bodega']),
  batchController.deleteBatch
);

module.exports = router;
