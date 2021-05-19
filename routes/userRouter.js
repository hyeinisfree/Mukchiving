var express = require('express');
var router = express.Router();
var db = require('../db');
var conn = db.init();

db.connect(conn);

router.get('/:id', (req, res) => {
  const id = req.params.id;
  if(!id) {
    return res.status(400).json({success: false});
  }
});

module.exports = router;