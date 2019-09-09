const local = require( './localStrategy' );
const { User } = require( '../models' );

module.exports = ( passport ) => {
    passport.serializeUser(( user, doen ) => {
        doen( null, user.id );
    });

    passport.deserializeUser(( id, doen ) => {
        User.findOne({
            where : { id },
            include : [{
                model : User,
                attributes : [ 'id', 'nick' ]
            }]
        })
        .then( user => doen( null, user ))
        .catch( err => doen( err ));
    });

    local( passport );
}
