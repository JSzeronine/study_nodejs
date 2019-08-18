var express = require('express');
var router = express.Router();
var { User } = require( '../models' );

/* GET users listing. */
router.get('/', function(req, res, next) {

  User.findAll().then(( user ) => {
    res.json( user );
  }).catch(( err ) => {
    console.error( err );
    next( err );
  })
});

// POST /users 
// 사용자등록
router.post( '/', ( req, res, next ) => {
  User.create({
    name : req.body.name,
    age : req.body.age,
    married : req.body.married
  }).then(( result ) => {
    console.log( result );
    res.status( 201 ).json( result );
  }).catch(( err ) => {
    console.error( err );
    next( err );
  });
});

module.exports = router;
