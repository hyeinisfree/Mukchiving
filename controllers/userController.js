const express = require('express');
const db = require('../db');
const { userService } = require('../services');
const conn = db.init();

db.connect(conn);

const { Op } = require("sequelize");
const { sequelize } = require("../models");
const User = require("../models/user");
const Profile = require("../models/profile");

const getAll = async (req, res) => {
  const allUser = await User.findAll();
  return res.json({allUser : allUser});
}

const info = (req, res) => {
  console.log(req.decoded)
  return res.json(req.decoded);
};

module.exports = {
  getAll,
  info
}