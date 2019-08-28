
const express = require( 'express' );
const bcrypt = require( 'bcrypt' );
const passport = require( 'passport' );
const { User } = require( '../models' );

const { isLoggedIn, isNotLoggedIn } = require( './middlewares' );
const router = express.Router();

// POST /auth/join
router.post( '/join', isNotLoggedIn, async ( req, res, next ) => {
    const { email, nick, password } = req.body;
    try{
        const exUser = await User.findOne({ where : { email }});

        if( exUser ){
            req.flash( 'joinError', '이미 가입된 이메일입니다.' );
            return res.redirect( '/join' );
        }

        console.time( "암호화시간" );
        const hash = await bcrypt.hash( password, 12 );     // 숫자가 높을수록 암호화가 복잡해진다 : 속도도 느려진다.
        console.timeEnd( "암호화시간 끝" );
        
        await User.create({
            email,
            nick,
            password : hash
        });

        return res.redirect( '/' );

    }catch( error ){
        console.error( error );
        next( error );
    }
});

// 로그인
router.post( '/login', isNotLoggedIn, ( req, res, next ) => { // req.body.email, req.body.password
    // passport/localStrategy.js 호출
    passport.authenticate( 'local', ( authError, user, info ) => {

        console.log( "여긴가?", info );

        if( authError ){
            return next( authError );
        }

        if( !user ){
            req.flash( 'loginError', info.message ); 
            return res.redirect( '/' );
        }

        // req.login ---> passport/index.js 에 passport.serializeUser 를 실행한다.
        return req.login( user, ( loginError ) => { // 로그인이 성공하면 req.user 사용자 정보를 확인할 수 있다.
            if( loginError ){
                console.log( loginError );
                return next( loginError );
            }

            return res.redirect( '/' );
        });

    })( req, res, next );
});

// 로그아웃
router.get( '/logout', isLoggedIn, ( req, res ) => {
    req.logout();
    req.session.destroy();
    res.redirect( '/' );
});

// passort//kakaoStrategy 
// ( 1 )
router.get( '/kakao', passport.authenticate( 'kakao' ));

// ( 3 )
router.get( '/kakao/callback', passport.authenticate( 'kakao', {
    failureRedirect : '/'
}), ( res, req ) => {
    req.redirect( '/' );
});

module.exports = router;