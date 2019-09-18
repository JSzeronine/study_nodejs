

module.exports = ( sequelize, DataTypes ) => {

    const Comments = sequelize.define( 'Comment', {
        content : {
            type : DataTypes.TEXT,
            allowNull : false,
        }
    }, {
        charset : 'utf8mb4',
        collate : 'utf8mb4_general_ci',
    });

    Comments.associate = ( db ) => {
        db.Comment.belongsTo( db.User );
        db.Comment.belongsTo( db.Post );
    };

    return Comments;
}