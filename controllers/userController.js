const express = require('express');
const db = require('../db');
const { userService } = require('../services');
const conn = db.init();

db.connect(conn);

module.exports = {

}