const LocalStrategy = require( 'passport-local' ).Strategy;
const bcrypt = require( 'bcrypt' );

const { User } = require( '../models' );

module.exports = ( passport ) => {
    passport.use( new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password'
    }, async ( email, password, done ) => {
        console.log( email, password );
        try{
            
            const exUser = await User.findOne({ where : { email }});

            if( exUser ){
                const result = await bcrypt.compare( password, exUser.password );
                if( result ){
                    done( null, exUser );
                }else{
                    down( null, false, { message : "이메일-비밀번호 조합이 맞지 않습니다."});
                }
            }else{
                done( null, false, { message : '이메일-비밀번호 조합이 맞지 않습니다.'})
            }
        }catch( error ){
            done( error );
        }
    }));
}