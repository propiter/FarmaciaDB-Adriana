const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { check } = require('express-validator');

// Validation rules
const productValidationRules = [
  check('nombre').notEmpty().withMessage('El nombre es requerido'),
  check('presentacion').notEmpty().withMessage('La presentación es requerida'),
  check('precio_venta').isDecimal().withMessage('Precio inválido'),
  check('codigo_barras').optional().isString(),
  check('temperatura_id').optional().isInt(),
  check('proveedor_id').optional().isInt()
];

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protected routes (require authentication)
router.use(authMiddleware.verifyToken);

// Admin-only routes
router.post('/', 
  authMiddleware.checkRole('admin'),
  productValidationRules,
  productController.createProduct
);

router.put('/:id', 
  authMiddleware.checkRole('admin'),
  productValidationRules,
  productController.updateProduct
);

router.delete('/:id', 
  authMiddleware.checkRole('admin'),
  productController.deleteProduct
);

module.exports = router;
