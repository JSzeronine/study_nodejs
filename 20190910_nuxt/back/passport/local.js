
const passport = require( 'passport' );
const bcrypt = require( 'bcrypt' );
const { Strategy : LocalStorage } = require( 'passport-local' );
const db = require( '../models' );

module.exports = () => {
    passport.use( new LocalStorage({

        usernameField : 'email',
        passwordField : 'password'

    }, async ( email, password, done ) => {

        try{
            const exUser = await db.User.findOne({
                where : {
                    email : email
                }
            });
    
            if( !exUser ){
                // done( 에러, 성공, 메세지 )
                return done( null, false, { reason : '존재하지 않는 사용자입니다.' });
            }
    
            const result = await bcrypt.compare( password, exUser.password );
    
            if( result ){
                return done( null, exUser );
            }else{
                return done( null, false, { reason : '비밀번호가 틀립니다.' });
            }
        }catch( err ){
            console.error( err );
            return done( err );
        }

    }));
}