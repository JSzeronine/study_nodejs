const express = require( 'express' );
const router = express.Router();
const { User } = require( "../models" );
const bcrypt = require( 'bcrypt' );
const passport = require( 'passport' );

router.post( '/', ( req, res, next ) => {
    var { email, password } = req.body.params;

    req.body.username = email;
    req.body.password = password;

    passport.authenticate( 'local', ( authError, user, info ) => {
        if( authError ){
            return next( autoError );
        }

        return req.login( user, ( loginError ) => {
            if( loginError ){
                console.error( loginError );
            }

            res.json({
                success : true
            });
        })

        // return req.login( user, ( loginError ) => {
        //     if( loginError ){
        //         console.error( loginError );
        //         return next( loginError );
        //     }

        //     res.json({
        //         success : true
        //     });
        // });
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