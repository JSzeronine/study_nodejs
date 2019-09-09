const express = require( 'express' );
const router = express.Router();

router.get( "/", ( req, res, next ) => {
    console.log( req.user );

    if( req.user ){
        res.json({
            success : true
        });
    }
});

module.exports = router;