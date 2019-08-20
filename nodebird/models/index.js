const Sequelize = require( 'sequelize' );
const env = process.env.NODE_ENV || 'development';
const config = require( '../config/config' )[ env ];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config
);

db.User = require( './user' )( sequelize, Sequelize );
db.Post = require( './post' )( sequelize, Sequelize );
db.Hashtag = require( './hashtag' )( sequelize, Sequelize );

db.User.Hashtag( db.Post );
db.Post.belongsTo( db.User );

db.Post.belongsToMany( db.Hashtag, { through : 'PostHashtag' });
db.Hashtag.belongsToMany( db.Post, { through : 'PostHashtag' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;