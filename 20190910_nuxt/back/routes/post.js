
const express = require( 'express' );
const multer = require( 'multer' );
const router = express.Router();
const path = require( 'path' );
const db = require( '../models' );

const { isLoggedIn } = require( './middlewares' );

router.post( '/', isLoggedIn, async ( req, res ) => {
    try{
        const newPost = await db.Post.create({
            content :req.body.content,
            UserId : req.user.id
        });

        const hashtags = req.body.content.match( /#[^\s#]+/g );
        if( hashtags ){
            // findOrCreate : 이미 있으면 저장하지 말고 없으면 저장해라.
            const result = await Promise.all( hashtags.map( tag => db.Hashtag.findOrCreate({
                where : {
                    name : tag.slice( 1 ).toLowerCase()
                }
            })));

            await newPost.addHashtags( result.map( r => r[ 0 ] ));
        }

        if( req.body.image ){
            if( Array.isArray( req.body.image )){
                await Promise.all( req.body.image.map(( image ) => {
                    return db.Image.create({ src : image, PostId : newPost.id });
                }));
            }else{
                await db.Image.create({ src : req.body.image, PostId : newPost.id });
            }
        }

        const fullPost = await db.Post.findOne({
            where : { id : newPost.id },
            include : [
                {
                    model : db.User,
                    attributes : [ 'id', 'nickname' ]   // User 정보 중 id와 nickname 만 넣어주는걸로
                }, 
                {
                    model : db.Image,
                }
            ]
        })

        return res.json( fullPost );

    }catch( error ){
        console.error( error );
        return next( error );
    }
});

const upload = multer({
    storage : multer.diskStorage({
        destination( req, file, done ){
            done( null, 'uploads' );
        },

        filename( req, file, done ){
            const ext = path.extname( file.originalname );  // 확장자
            const basename = path.basename( file.originalname, ext );
            const filename = basename + Date.now() + ext;
            done( null, filename );
        }
    }),

    limits : { fileSize : 20 * 1024 * 1024 },
});
                                    // 'image' == key
router.post( '/images', isLoggedIn, upload.array( 'image' ), ( req, res ) => {
    console.log( req.files );
    res.json( req.files.map( v => v.filename ));
});

router.get( '/:id/comments', async ( req, res, next ) => {

    try{
        const post = await db.Comment.findOne({
            where : { PostId : req.params.id }
        });

        if( !post ){
            return res.status( 404 ).send( '댓글이 존재하지 않습니다.' );
        };

        const comments = await db.Comment.findAll({
            where : { PostId : req.params.id },
            include : [{
                model : db.User,
                attributes : [ 'id', 'nickname' ]
            }],

            order : [[ 'createdAt', 'ASC']]
        });

        res.json( comments );

    }catch( error ){
        console.error( error );
        return next( error );
    }
});

router.post( '/:id/comment', async ( req, res, next ) => {
    try{
        const post = await db.Post.findOne({
            where : { id : req.params.id }
        });

        if( !post ){
            return res.status( 404 ).send( "포스트가 존재하지 않습니다." );
        }

        const newComment = await db.Comment.create({
            PostId : post.id,
            UserId : req.user.id,
            content : req.body.content
        });

        const comment = await db.Comment.findOne({
            where : { id : newComment.id },
            include : [{
                model : db.User,
                attributes : [ 'id', 'nickname' ]
            }]
        });

        return res.json( comment );

    }catch( error ){

        console.error( error );
        return next( error );

    }
});

router.delete( "/:id", async ( req, res, next ) => {
    try{

        await db.Post.destroy({
            where : { id : req.params.id }
        });

        res.send( "삭제 되었습니다." );

    }catch( error ){
        console.error( error );
        return next( error );
    }
})

module.exports = router;

