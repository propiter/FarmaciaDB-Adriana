const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const reportController = require('../controllers/report.controller');
const { check } = require('express-validator');

// Middleware de autenticación
router.use(authMiddleware.verifyToken);

// Rutas de reportes
router.get('/inventory', reportController.getInventoryReport);
router.get('/sales', 
  [
    check('startDate').isISO8601().toDate(),
    check('endDate').isISO8601().toDate()
  ],
  reportController.getSalesReport
);
router.get('/inventory/export-excel', 
  authMiddleware.checkRole(['admin']),
  reportController.exportInventoryExcel
);

module.exports = router;
