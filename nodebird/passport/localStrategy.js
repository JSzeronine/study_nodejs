
const LocalStrategy = require( 'passport-local' ).Strategy;
const bcrypt = require( 'bcrypt' );

const { User } = require( '../models' );



module.exports = ( passport ) => {
    passport.use( new LocalStrategy({

        usenameField : 'email',                 // req.body.email
        passwordField : 'password'              // req.body.password

    }, async ( email, password, done ) => {     //  done( 에러, 성공, 실패 );
        try{
            // 이메일 검사
            const exUser = await User.find({ where : { email }});

            if( exUser ){
                // 비밀번호 검사
                const result = await bcrypt.compare( password, exUser,password );
                if( result ){
                    done( null, exUser );
                }else{
                    done( null, false, { message : '이메일-비밀번호 조합이 맞지 않습니다.' });
                }
            }else{
                done( null, false, { message : '이메일-비밀번호 조합이 맞지 않습니다.' });
            }
        }catch( error ){
            console.error( error );
            done( error );
        }
    }));
}
