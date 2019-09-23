const express = require( 'express' );
const db = require( "../models" );

const router = express.Router();

router.get( "/", async ( req, res, next ) => {      //req.query -> /posts?offset=10&limit=10

    try{
        const posts = await db.Post.findAll({
            include : [{
                model : db.User,
                attributes : [ "id", "nickname" ]
            }, {
                model : db.Image,
            }],

            order : [[ "createdAt", "DESC" ]],
            // offset : parseInt( req.query.offset, 10 ) || 10,
            // limit : parseInt( req.query.limit, 10 ) || 10,
        });

        return res.json( posts );

    }catch( error ){
        console.error( error );
        return next( error );
    }
});

module.exports = router;
