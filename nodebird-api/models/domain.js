module.exports = ( sequelize, DataTypes ) => {
    sequelize.define( 'domain', {
        host : {
            type : DataTypes.STRING( 80 ),
            allowNull : false
        },
        type : {
            type : DataTypes.STRING( 10 ),
            allowNull : false
        },
        clientSecret : {
            type : DataTypes.STRING( 40 ),
            allowNull : false
        }
    }, {
        timestamps : true,
        paranoid : true,
        validate : {

        }
    })
}

// Domain.create({ host : '', type : '', clientSecret : '' });