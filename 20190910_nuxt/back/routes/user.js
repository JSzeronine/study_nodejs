const express = require( 'express' );
const bcrypt = require( 'bcrypt' );
const passport = require( 'passport' );
const db = require( '../models' );

const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require( './middlewares' );

router.get( "/", isLoggedIn, async ( req, res, next ) => {
    const user = req.user;
    res.json( user );
});


router.get( "/:id", async ( req, res, next ) => {
    try{
        const user = await db.User.findOne({
            where : { id : parseInt( req.params.id, 10 )},
            include : [{
                model : db.Post,
                as : "Posts",
                attributes : [ "id" ],
            }, {
                model : db.User,
                as : "Followings",
                attributes : [ "id" ],
            }, {
                model : db.User,
                as : "Followers",
                attributes : [ "id" ]
            }],

            attributes : [ "id", "nickname" ],
        });

        console.log( user );

        res.json( user );

    }catch( error ){
        console.error( error );
        return next( error );
    }
})


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

            const fullUser = await db.User.findOne({
                where : { id : user.id },
                attributes : [ "id", "email", "nickname" ],
                include : [{
                    model : db.Post,
                    attributes : [ "id" ]
                }, {
                    model : db.User,
                    as : "Followings",
                    attributes : [ "id" ]
                }, {
                    model : db.User,
                    as : "Followers",
                    attributes : [ "id" ],
                }]
            })

            return res.json( fullUser );
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

// 팔로우
router.post( '/:id/follow', isLoggedIn, async ( req, res, next ) => {

    try{

        const me = await db.User.findOne({
            where : {
                id : req.user.id
            }
        });

        await me.addFollowing( req.params.id );
        res.send( req.params.id );

    }catch( error ){
        console.error( error );
        return next( error );
    }
    
})

// 팔로우 끊기
router.delete( '/:id/follow', isLoggedIn, async ( req, res, next ) => {

    try{

        const me = await db.User.findOne({
            where : {
                id : req.user.id
            }
        });

        await me.removeFollowing( req.params.id );
        res.send( req.params.id );

    }catch( error ){
        console.error( error );
        return next( error );
    }
    
});

// 닉네임 변경
router.patch( '/nickname', isLoggedIn, async ( req, res, next ) => {

    try{

        await db.User.update({
            nickname : req.body.nickname
        }, {
            where : {
                id : req.user.id
            }
        });
        
        res.send( req.body.nickname );

    }catch( error ){
        console.error( error );
        return next( error );
    }
});

router.get( '/:id/followings', isLoggedIn, async ( req, res, next ) => {
    try{
        const user = await db.User.findOne({
            where : { id : req.user.id },
        });

        const followings = await user.getFollowings({
            attributes : [ "id", "nickname" ],
            limit : parseInt( req.query.limit || 3, 10 ),
            offset : parseInt( req.query.offset || 0, 10 ),
        });

        res.json( followings );

    }catch( err ){
        console.error( err );
        return next( err );
    }
});

router.get( "/:id/followers", isLoggedIn, async ( req, res, next ) => {
    try{
        const user = await db.User.findOne({
            where : { id : req.user.id },
        });

        const followers = await user.getFollowers({
            attributes : [ "id", "nickname" ],
            limit : parseInt( req.query.limit || 3, 10 ),
            offset : parseInt( req.query.offset || 0, 10 )
        });

        res.json( followers );

    }catch( error ){
        console.error( error );
        return next( error );
    }
});


router.delete( "/:id/follower", isLoggedIn, async ( req, res, next ) => {
    try{
        const me = await db.User.findOne({
            where : { id : req.user.id },
        });

        await me.removeFollower( req.params.id );
        res.send( req.params.id );

    }catch( error ){
        console.error( error );
        return next( error );
    }
})

module.exports = router;
