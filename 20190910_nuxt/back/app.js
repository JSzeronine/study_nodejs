const express = require( 'express' );
const bcrypt = require( 'bcrypt' );
const db = require( './models' );
const passportConfig = require( './passport' );
const passport = require( 'passport' );
const session = require( 'express-session' );
const cookie = require( 'cookie-parser' );
const app = express();
const cors = require( 'cors' );
const morgan = require( 'morgan' );

db.sequelize.sync({ 
    // force : true // 매번 데이터 날린다. 
});
passportConfig();

app.use( morgan( 'dev' ));
app.use( cors({
    origin : 'http://localhost:3000',
    credentials : true
}));

app.use( express.json());
app.use( express.urlencoded({ extended : false }));
app.use( cookie( 'cookiesecret' ));
app.use( session({ 
    resave : false, 
    saveUninitialized : false, 
    secret : 'cookiesecret',
    cookie : {
        httpOnly : true,
        secure : false,
    }
}));
app.use( passport.initialize());
app.use( passport.session());

app.get( '/', ( req, res ) => {
    res.status( 200 ).send( "안녕 백엔드" );
});

app.post( '/user', async ( req, res, next ) => {

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

app.post( '/user/login', ( req, res, next ) => {

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

app.listen( 3085, () => {
    console.log( `백엔드 서버 ${ 3085 }번 포트에서 작동중.` );
});



