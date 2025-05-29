const nodemailer = require('nodemailer');
const { Product, Batch } = require('../models');

// Configuración del transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const notificationService = {
  // Enviar correo genérico
  sendEmail: async (to, subject, html) => {
    try {
      await transporter.sendMail({
        from: `"Farmacia App" <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        html
      });
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  },

  // Notificación de productos próximos a vencer
  checkExpiringProducts: async () => {
    const warningDate = new Date();
    warningDate.setMonth(warningDate.getMonth() + 6);
    
    const expiringProducts = await Product.findAll({
      include: [
        {
          model: Batch,
          as: 'lote',
          where: {
            fecha_vencimiento: {
              [Op.lte]: warningDate
            },
            cantidad_disponible: { [Op.gt]: 0 }
          },
          required: true
        }
      ]
    });
    
    if (expiringProducts.length > 0) {
      const html = `<h2>Productos próximos a vencer</h2>
        <ul>
          ${expiringProducts.map(p => 
            `<li>${p.nombre} - Lotes: 
              ${p.lotes.map(l => 
                `${l.lote_id} (Vence: ${l.fecha_vencimiento})`
              ).join(', ')}
            </li>`
          ).join('')}
        </ul>`;
      
      await this.sendEmail(
        process.env.ADMIN_EMAIL,
        'Alertas de productos próximos a vencer',
        html
      );
    }
  },

  // Notificación de stock bajo
  checkLowStock: async () => {
    const lowStockProducts = await Product.findAll({
      where: {
        stock: {
          [Op.lt]: sequelize.col('stock_minimo')
        }
      }
    });
    
    if (lowStockProducts.length > 0) {
      const html = `<h2>Productos con stock bajo</h2>
        <ul>
          ${lowStockProducts.map(p => 
            `<li>${p.nombre} - Stock: ${p.stock} (Mínimo: ${p.stock_minimo})</li>`
          ).join('')}
        </ul>`;
      
      await this.sendEmail(
        process.env.ADMIN_EMAIL,
        'Alertas de stock bajo',
        html
      );
    }
  }
};

module.exports = notificationService;
