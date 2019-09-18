
const express = require( 'express' );
const router = express.Router();

const { isLoggedIn } = require( './middlewares' );

router.post( '/images', isLoggedIn, ( req, res ) => {
    
});

router.post( '/', isLoggedIn, ( req, res ) => {

});

module.exports = router;