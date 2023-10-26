const dbConfig = require("../db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.equipment = require("./equipment.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
db.booking = require("./booking.model.js")(sequelize, Sequelize);
db.report = require("./report.model.js")(sequelize, Sequelize);

db.booking.belongsTo(db.equipment.Equipment);
db.booking.belongsTo(db.user.User);
db.equipment.Equipment.hasMany(db.booking);
db.user.User.hasMany(db.booking);

db.report.Report.belongsTo(db.booking)

module.exports = db;
