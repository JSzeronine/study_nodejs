const express = require( 'express' );
const multer = require( 'multer' );
const router = express.Router();
const path = require( 'path' );
const { Post, Hashtag, User } = require( '../models' );
const { isLoggedIn } = require( './middlewares' );

// <form enctype="multipart/form-data"> // 참고
const upload = multer({
    storage : multer.diskStorage({

        destination( req, file, cd ){
            cd( null, 'uploads/' ); // cd : 콜백함수 -> error, 설정
        },

        filename( req, file, cd ){
            const ext = path.extname( file.originalname );
            cd( null, path.basename( file.originalname, ext ) + new Date().valueOf() + ext ) // 파일명 중복을 막기 위해 Date()를 이용한다.
        },

    }),

    limit : { fileSize : 5 * 1024 * 1024 },
});

// <form>-> <input type='file' id='img'>
router.post( '/img', isLoggedIn, upload.single( 'img' ), ( req, res ) => {
    console.log( req.file );
    res.json({ url : `/img/${ req.file.filename }` });
});

const upload2 = multer();
router.post( '/', isLoggedIn, upload2.none(), async ( req, res, next ) => {
    // 게시글 업로드

    try{
        const post = await Post.create({
            content : req.body.content,
            img : req.body.url,
            userId : req.user.id
        });

        // 안녕하세요 #노드 #익스프레스
        // hashtags = [ '#노드', '#익스프레스' ]
        const hashtags = req.body.content.match( /#[^\s#]*/g );
        if( hashtags ){
            const result = await Promise.all( hashtags.map( tag => Hashtag.findOrCreate({
                where : {
                    title : tag.slice( 1 ).toLowerCase() // #를 빼고, 대소문자 제거를 한다.
                }
            })));

            await post.addHashtags( result.map( r => r[ 0 ]));
        }

        res.redirect( '/' );

    }catch( error ){
        console.error( errer );
        next( error );
    }
});

router.get( '/hashtag', async ( req, res, next ) => {
    const query = req.query.hashtag;
    if( !query ){
        return res.redirect( '/' );
    }

    try{

        const hashtag = await Hashtag.findOne({ where : { title : query }});
        let posts = [];

        if( hashtag ){
            posts = await hashtag.getPosts({ include : [{ model : User }]});
        }

        return res.render( 'main', {
            title : `${ query } | NodeBird`,
            user : req.user,
            twits : posts,
        });

    }catch( error ){
        console.error( error );
        next( error );
    }
});

router.post( '/:id/like', async ( req, res, next ) => {
    try{
        const post = await Post.findOne({ where : { id : req.params.id }});
        await post.addLiker( req.user.id );
        res.send( 'OK' );
    }catch( error ){
        console.error( error );
        next( error );
    }
})

router.delete( '/:id/like', async( req, res, next ) => {
    try{
        const post = await Post.findOne({ where : { id : req.params.id }});
        await post.removeLiker( req.user.id );
        res.send( 'OK' );
    }catch( error ){
        console.error( error );
        next( error );
    }
})

router.delete( '/:id', async ( req, res, next ) => {
    try{
        await Post.destroy({ where : { id : req.params.id, userId: req.user.id }});
        res.send( 'OK' );
    }catch( error ){
        console.error( error );
        next( error );
    }
})

module.exports = router;