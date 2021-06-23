var mysql = require('mysql');
var db = require('../db');
var conn = db.init();
db.connect(conn);

const { Op } = require("sequelize");
const { sequelize } = require("../models");
const Follow = require("../models/follow");

const checkFollow = function(sender_id, receiver_id) {
  try {
    const follow = Follow.findOne({
      where: {follow_sender: sender_id, follow_receiver: receiver_id},
    });
    if (!follow) {
      return null;
    }
    return follow.getAll();
  } catch (error) {
    return error;
  }
}

const createFollow = function(data, callback) {
  var params = data;  
  var sql = 'insert into follow(follow_receiver, follow_sender, created_at, accept) values (?, ?, now(), ?)';
  conn.query(sql, params, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
    return;
  })
}

const unfollow = function(data, callback) {
  var params = data;
  var sql = 'delete from follow where follow_receiver = ? and follow_sender = ?';
  conn.query(sql, params, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
    return;
  })
}

const followerList = function(user_id, callback) {
  var params = [user_id];
  var sql = 'select follow_sender from follow where follow_receiver = ?';
  conn.query(sql, params, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
    return;
  })
}

const followingList = function(user_id, callback) {
  var params = [user_id];
  var sql = 'select follow_receiver from follow where follow_sender = ?';
  conn.query(sql, params, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
    return;
  })
}

const followerInfo = function(array, callback) {
  var params = array.join();
  var sql = `select user_id, username, profile_image from profile where user_id in (${params})`;
  conn.query(sql, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
    return;
  })
}

const followingInfo = function(array, callback) {
  var params = array.join();
  var sql = `select user_id, username, profile_image from profile where user_id in (${params})`;
  conn.query(sql, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
    return;
  })
}

module.exports = {
  checkFollow,
  createFollow,
  unfollow,
  followerList,
  followingList,
  followerInfo,
  followingInfo
}