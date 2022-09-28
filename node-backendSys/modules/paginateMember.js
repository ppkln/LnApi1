const dbconfig = require('../db.config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbconfig.DB,dbconfig.USER,dbconfig.PASSWORD,{
  host: dbconfig.HOST,
  dialect: dbconfig.dialect,
  operatorsAliases:false,
  pool:{
    max: dbconfig.pool.max,
    min: dbconfig.pool.min,
    acquire: dbconfig.pool.acquire,
    idle: dbconfig.pool.idle
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.member = require("./member.model")(sequelize, Sequelize);

module.exports = db;
