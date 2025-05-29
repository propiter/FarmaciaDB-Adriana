module.exports = (sequelize, DataTypes) => {
  const Config = sequelize.define('Config', {
    clave: {
      type: DataTypes.STRING(50),
      primaryKey: true
    },
    valor: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue('valor');
        try {
          return JSON.parse(rawValue);
        } catch {
          return rawValue;
        }
      },
      set(value) {
        this.setDataValue('valor', typeof value === 'string' ? value : JSON.stringify(value));
      }
    }
  }, {
    tableName: 'configuracion_sistema',
    timestamps: false
  });

  return Config;
};
