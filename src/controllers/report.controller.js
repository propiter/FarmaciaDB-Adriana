const reportService = require('../services/report.service');

const reportController = {
  getInventoryReport: async (req, res) => {
    try {
      const inventory = await reportService.getInventoryReport();
      
      // Clasificar por estado de vencimiento
      const classified = inventory.map(product => {
        const lots = product.lotes.map(lot => {
          const monthsLeft = (new Date(lot.fecha_vencimiento) - new Date()) / (1000 * 60 * 60 * 24 * 30);
          let status = 'success';
          if (monthsLeft <= 6) status = 'danger';
          else if (monthsLeft <= 12) status = 'warning';
          
          return { ...lot.toJSON(), status };
        });
        
        return { ...product.toJSON(), lotes: lots };
      });
      
      res.json(classified);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getSalesReport: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const sales = await reportService.getSalesReport(startDate, endDate);
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  exportInventoryExcel: async (req, res) => {
    try {
      const inventory = await reportService.getInventoryReport();
      const workbook = await reportService.exportToExcel(
        inventory.map(item => ({
          name: item.nombre,
          stock: item.stock,
          price: item.precio_venta
        })),
        [
          { header: 'Producto', key: 'name', width: 30 },
          { header: 'Stock', key: 'stock', width: 15 },
          { header: 'Precio', key: 'price', width: 15 }
        ]
      );
      
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=inventario.xlsx'
      );
      
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = reportController;
