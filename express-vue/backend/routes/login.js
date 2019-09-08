const express = require( 'express' );
const router = express.Router();
const { User } = require( "../models" );
const bcrypt = require( 'bcrypt' );

router.post( '/', async ( req, res, next ) => {

    var { email, password } = req.body.params;

    try{
        const exUser = await User.findOne({ where : { email }});

        if( exUser ){
            bcrypt.compare( password, exUser.password, function( err, result ){
                if( result ){
                    res.json({ success : true, message : "login success" });
                }
            });
        }

    }catch( error ){
        console.error( error );
        next( error );
    }
})

module.exports = router;