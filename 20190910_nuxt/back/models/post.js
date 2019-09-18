

module.exports = ( sequelize, DataTypes ) => {
    const Post = sequelize.define( 'Post', { // 테이블명 -> posts 로 생성된다.
        content : {
            type : DataTypes.TEXT,
            allowNull : false,
        }
    }, {
        charset : 'utf8mb4',
        collate : 'utf8mb4_general_ci',
    });

    Post.associate = ( db ) => {
        db.Post.belongsTo( db.User );   // UserId 가 생성된다.
        db.Post.hasMany( db.Comment );
        db.Post.hasMany( db.Image );
        db.Post.belongsToMany( db.Hashtag, { through : 'PostHashtag' });
    };

    return Post;
}