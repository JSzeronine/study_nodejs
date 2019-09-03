module.exports = ( sequelize, DataTypes ) => (

    sequelize.define( 'image', {
        url : {
            type : DataTypes.STRING( 140 ),
            allowNull : false
        }
    },
    {
        timestamps: true,
        paranoid: true,
        charset: 'utf8',
        collate : 'utf8_general_ci'
    })
);