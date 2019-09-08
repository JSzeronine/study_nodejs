const Sequelize = require( 'sequelize' );
const config = require( '../config/config' )[ "development" ];
const db = {};

const sequelize = new Sequelize(
    config.database, config.username, config.password, config
)

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require( './user' )( sequelize, Sequelize );

module.exports = db;