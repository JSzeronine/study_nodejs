const express = require( 'express' );
const bcrypt = require( 'bcrypt' );
const db = require( './models' );
const app = express();
const cors = require( 'cors' );

db.sequelize.sync();

app.use( express.json() );
app.use( express.urlencoded({ extended : false }));
app.use( cors( 'http://localhost:3000' ) );

app.get( '/', ( req, res ) => {
    // res.send( '안녕 백엔드' );
    res.status( 200 ).send( "안녕 백엔드" );
});

app.post( '/user', async ( req, res, next ) => {

    try{
        
        const hash = await bcrypt.hash( req.body.password, 12 );
        const newUser = await db.User.create({
            email : req.body.email,
            nickname : req.body.nickname,
            password : hash,
        });

        // 201 성공적으로 생성됐다.
        // HTTP  STATUS CODE 검색해봐.
        res.status( 201 ).json( newUser );

    }catch( error ){
        console.error( error );
        next( error );
    }

})

app.listen( 3085, () => {
    console.log( `백엔드 서버 ${ 3085 }번 포트에서 작동중.` );
});



