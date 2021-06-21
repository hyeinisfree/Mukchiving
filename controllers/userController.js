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

module.exports = {
  userTest
}