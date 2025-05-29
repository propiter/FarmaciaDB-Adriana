const cron = require('node-cron');
const notificationService = require('../services/notification.service');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Programar tareas diarias a las 8 AM
const setupNotificationJobs = () => {
  // Verificar productos próximos a vencer
  cron.schedule('0 8 * * *', () => {
    console.log('Running expiring products check...');
    notificationService.checkExpiringProducts();
  });
  
  // Verificar stock bajo
  cron.schedule('0 8 * * *', () => {
    console.log('Running low stock check...');
    notificationService.checkLowStock();
  });
};

module.exports = setupNotificationJobs;
