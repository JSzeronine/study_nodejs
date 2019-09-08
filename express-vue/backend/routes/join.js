const express = require( 'express' );
const bcrypt = require( 'bcrypt' );
const passport = require( 'passport' );
const { User } = require( '../models' );

const router = express.Router();
router.post( '/', async ( req, res, next ) => {

    const { email, nick, password } = req.body.params;

    try{
        const exUser = await User.findOne({ where : { email }});

        if( exUser ){
            console.log( "회원가입 실패" );
            res.redirect( '/' );
        }

        const hash = await bcrypt.hash( password, 12 );
        await User.create({
            email : email, 
            nick : nick, 
            password : hash
        });

        res.json({
            success : true,
            message : "Join Success"
        });

    }catch( error ){
        console.error( error );
        next( error );
    }

});

module.exports = router;