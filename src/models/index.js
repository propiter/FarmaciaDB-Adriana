const sequelize = require('../config/database');
const fs = require('fs');
const path = require('path');
const { Model, DataTypes } = require('sequelize');

const models = {};

// Cargar todos los modelos automáticamente
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== path.basename(__filename) &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    try {
      const modelModule = require(path.join(__dirname, file));
      const model = modelModule(sequelize, DataTypes);
      models[model.name] = model;
    } catch (error) {
      console.error(`Error cargando modelo: ${file}`, error);
    }
  });

// Establecer asociaciones
Object.keys(models).forEach(modelName => {
  if (typeof models[modelName].associate === 'function') {
    models[modelName].associate(models);
  }
});

module.exports = {
  ...models,
  sequelize
};
