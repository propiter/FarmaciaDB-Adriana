const db = require('../src/config/database');
console.log('DB Config:', Object.keys(db));
console.log('Sequelize:', db.sequelize?.constructor.name);