const { Config } = require('../models');

module.exports = {
  async getConfig(key, defaultValue = null) {
    const config = await Config.findByPk(key);
    return config ? config.valor : defaultValue;
  },

  async setConfig(key, value) {
    const [config] = await Config.upsert({
      clave: key,
      valor: value
    });
    return config;
  },

  async getIVA() {
    return parseFloat(await this.getConfig('iva_porcentaje', 19)) || 19;
  }
};
