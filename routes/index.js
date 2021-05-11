var express = require('express');
const db = require('./../db');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', function(req, res, next) { 
  db.getAllUsers((rows) =>{ 
    console.log(rows);
    res.send(rows);
  });
});

module.exports = router;
