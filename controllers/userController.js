const express = require('express');
const db = require('../db');
const { userService } = require('../services');
const conn = db.init();

db.connect(conn);

const userTest = (req, res) => {
  var list = userService.userTest();
  console.log(list);
  return res.json({list: list});
}

const info = (req, res) => {
  console.log(req.decoded)
  return res.json(req.decoded);
};

module.exports = {
  userTest,
  info
}