const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize = new Sequelize(config.database, config.username, config.password, config);

db.User = require( './user' )( sequelize, Sequelize );
db.Post = require( './post' )( sequelize, Sequelize );
db.Comment = require( './comment' )( sequelize, Sequelize );
db.Hashtag = require( './hashtag' )( sequelize, Sequelize );
db.Image = require( './image' )( sequelize, Sequelize );

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
