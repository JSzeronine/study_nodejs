var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {

  console.log( "여기를 찾니?", req.user );
  
});

module.exports = router;
