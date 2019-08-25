
const KakaoStrategy = require( 'passport-kakao' ).Strategy;

const { User } = require( '../models' );

module.exports = ( passport ) => {

    // ( 2 )
    passport.use( new KakaoStrategy({

        clientID : process.env.KAKAO_ID,
        callbackURL : '/auth/kakao/callback'
    // ( 4 )
    }, async ( accessToken, refreshToken, profile, done ) => {

        try{
            const exUser = await User.findOne({
                where : {
                    snsID : profile.id,
                    provider : 'kakao'
                }
            });
    
            if( exUser ) {
                done( null, exUser );
            }else{
    
                const newUser = await User.create({
                    email : profile._json && profile._json.kaccount_email,
                    nick : profile.displayName,
                    snsId : profile.id,
                    provider : 'kakao'
                });
    
                done( null, newUser );
            }
        }catch( error ){
            console.log( error );
            done( error );
        }

    }));
}