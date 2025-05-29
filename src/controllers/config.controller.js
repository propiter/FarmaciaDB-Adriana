const configService = require('../services/config.service');

module.exports = {
  async getAll(req, res) {
    const configs = await configService.Config.findAll();
    res.json(configs);
  },

  async getByKey(req, res) {
    const value = await configService.getConfig(req.params.key);
    res.json({ [req.params.key]: value });
  },

  async createOrUpdate(req, res) {
    const config = await configService.setConfig(req.body.clave, req.body.valor);
    res.json(config);
  },

  async delete(req, res) {
    await configService.Config.destroy({ where: { clave: req.params.key } });
    res.status(204).end();
  }
};
