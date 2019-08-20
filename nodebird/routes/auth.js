

const express = require( 'express' );
const bcrypt = require( 'bcrypt' );
const { User } = require( '../models' );

const router = express.Router();
// POST /auth/join
router.post( '/join', ( req, res, next ) => {
    const { email, nick, password } = req.body;
    try{
        const exUser = await User.find({ where : { email }});

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

router.post( '/login', ( req, res, next ) => {

});

module.exports = router;