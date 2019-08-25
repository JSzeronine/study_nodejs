const local = require( './localStrategy' );
// const kakao = require( './kakaoStrategy' );
const { User } = require( '../models' );

module.exports = ( passport ) => {
    passport.serializeUser(( user, done ) => {
        done( null, user.id );
    });

    passport.deserializeUser(( id, done ) => {
        User.find({ where : { id }})
            .then( user => done( null, user ))
            .catch( err => done( err ));
    });


    local( passport );
    // kakao( passport );
<<<<<<< HEAD
 
=======
    
>>>>>>> 2d24f37d87f18375e4f22a104ccbe2533452306f
}