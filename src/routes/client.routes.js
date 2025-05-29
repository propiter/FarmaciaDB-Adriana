const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { check } = require('express-validator');

// Validation rules
const clientValidationRules = [
  check('nombre').notEmpty().withMessage('El nombre es requerido'),
  check('documento').optional().isString(),
  check('telefono').optional().isString(),
  check('correo').optional().isEmail().withMessage('Correo inválido'),
  check('tipo').isIn(['normal', 'frecuente', 'mayorista']).withMessage('Tipo inválido')
];

// Public routes
router.get('/', clientController.getAllClients);
router.get('/:id', clientController.getClientById);

// Protected routes (require authentication)
router.use(authMiddleware.verifyToken);

// Admin and cashier routes
router.post('/', 
  authMiddleware.checkRole(['admin', 'cajero']),
  clientValidationRules,
  clientController.createClient
);

router.put('/:id', 
  authMiddleware.checkRole(['admin', 'cajero']),
  clientValidationRules,
  clientController.updateClient
);

router.delete('/:id', 
  authMiddleware.checkRole(['admin', 'cajero']),
  clientController.deleteClient
);

module.exports = router;
