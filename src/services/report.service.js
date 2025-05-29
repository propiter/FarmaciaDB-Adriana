const { Product, Batch, Sale, SaleDetail, sequelize } = require('../models');
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

const reportService = {
  // Reporte de inventario con vencimientos
  getInventoryReport: async () => {
    const now = new Date();
    const warningDate = new Date();
    warningDate.setMonth(warningDate.getMonth() + 6);
    
    return await Product.findAll({
      include: [
        {
          model: Batch,
          as: 'lotes',
          where: {
            cantidad_disponible: { [Op.gt]: 0 }
          },
          required: false
        }
      ],
      order: [
        ['nombre', 'ASC'],
        [{ model: Batch, as: 'lotes' }, 'fecha_vencimiento', 'ASC']
      ] 
    });
  },

  // Reporte de ventas por periodo
  getSalesReport: async (startDate, endDate) => {
    return await Sale.findAll({
      where: {
        fecha_venta: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [
        { model: User, as: 'usuario', attributes: ['nombre'] },
        { model: Client, as: 'cliente', attributes: ['nombre'] },
        {
          model: SaleDetail,
          as: 'detalles',
          include: [
            { model: Product, as: 'producto', attributes: ['nombre'] }
          ]
        }
      ],
      order: [['fecha_venta', 'DESC']]
    });
  },

  // Exportar a Excel
  exportToExcel: async (data, columns) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');
    
    worksheet.columns = columns;
    data.forEach(item => worksheet.addRow(item));
    
    return workbook;
  },

  // Exportar a PDF
  exportToPDF: async (data, title) => {
    const doc = new PDFDocument();
    doc.fontSize(16).text(title, { align: 'center' });
    doc.moveDown();
    
    data.forEach(item => {
      doc.fontSize(12).text(`${item.label}: ${item.value}`);
      doc.moveDown();
    });
    
    return doc;
  }
};

module.exports = reportService;
