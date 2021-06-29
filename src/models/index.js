const config = require('../config/index');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(config.databaseURL);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user.model')(sequelize);

module.exports = db;
