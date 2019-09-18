const express = require( 'express' );
const bcrypt = require( 'bcrypt' );
const passport = require( 'passport' );
const db = require( '../models' );

const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require( './middlewares' );

// 회원가입
router.post( '/', isNotLoggedIn, async ( req, res, next ) => {

    try{
        const exUser = await db.User.findOne({
            where : {
                email : req.body.email
            }
        });

        // 400 거절
        // 403 금지 
        // 401 권한 없음 
        if( exUser ){
            return res.status( 403 ).json({
                errorCode : 1, // 이건 마음대로 설정
                message : '이미 회원 가입되어 있습니다.'
            });
        }
        
        const hash = await bcrypt.hash( req.body.password, 12 );
        const newUser = await db.User.create({
            email : req.body.email,
            nickname : req.body.nickname,
            password : hash,
        });

        // 201 성공적으로 생성됐다.
        // HTTP  STATUS CODE 검색해봐.
        return res.status( 201 ).json( newUser );

    }catch( error ){
        console.error( error );
        return next( error );
    }
});

// 로그인
router.post( '/login', isNotLoggedIn, ( req, res, next ) => {

    // done( 에러, 성공, 메세지 )
    passport.authenticate( 'local', ( err, user, info ) => {

        if( err ){
            console.error( err );
            return next( err );
        }

        if( info ){
            return res.status( 401 ).send( info.reason );
        }

        // session에 사용자 정보 저장
        // passport/index.js -> serializeUser 실행
        return req.login( user, async ( err ) =>{
            if( err ){
                console.error( err );
                return next( err );
            }

            return res.json( user );
        });

        
    })( req, res, next );
});

// 로그아웃
router.post( '/logout', isLoggedIn, ( req, res ) => {
    if( req.isAuthenticated() ){
        req.logout();
        req.session.destroy();
        return res.status( 200 ).send( '로그아웃 되었습니다.' );
    }
});

module.exports = router;
