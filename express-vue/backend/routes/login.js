const express = require( 'express' );
const router = express.Router();
const { User } = require( "../models" );
const bcrypt = require( 'bcrypt' );
const passport = require( 'passport' );

router.post( '/', ( req, res, next ) => {
    var { email, password } = req.body.params;

    console.log( "일단 여기까진 오는데.." );
    console.log( passport );

    passport.authenticate( 'local', ( authError, user, info ) => {
        if( authError ){
            return next( autoError );
        }

        if( !user ){
            console.log( "error" );
        }

        return req.login( user, ( loginError ) => {
            if( loginError ){
                console.error( loginError );
                return next( loginError );
            }

            res.json({
                success : true
            });
        });
    })( req, res, next );


    // try{
    //     const exUser = await User.findOne({ where : { email }});
    //     const hash = await bcrypt.hash( password, 12 );

    //     if( exUser ){

    //         bcrypt.compare( password, exUser.password, function( err, result ){
    //             if( result ){
    //                 res.json({ success : true, message : "login success" });
    //             }
    //         });

    //     }

    // }catch( error ){
    //     console.error( error );
    //     next( error );
    // }
})


module.exports = router;