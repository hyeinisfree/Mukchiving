var mysql = require('mysql');
var db = require('../db');
var conn = db.init();
db.connect(conn);

const getPostIdByTitle = function(title, callback){
  var params = [title];
  var sql = 'select post_id from post where title = ?';
  conn.query(sql, params, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
    return;
  });
}

const userPost = function(user_id, callback){
  var params = [user_id];
  var sql = 'select * from post where user_id = ?;';
  conn.query(sql, params, function (err, results) {
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
    return;
  });
};

const createPostImages = function(image_data, callback) {
  var post_id = image_data.post_id;
  var images = image_data.images
  var sqls = "";
  var sql = 'insert into post_images (post_id, image_url, num) values (?, ?, ?);';
  for(var i=0; i<images.length; i++){
    var arr = [];
    arr.push(post_id);
    arr.push(images[i]);
    arr.push(i);
    console.log(arr);
    sqls += (mysql.format(sql, arr));
  }
  console.log(sqls);
  conn.query(sqls, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
  })
}

const getPostImages = function(post_id, callback) {
  var params = [post_id];
  var sql = 'select image_url from post_images where post_id = ?';
  conn.query(sql, params, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
  })
}

const createPost = function(data, callback) {
  console.log(data);
  var params1 = data;
  var sql1 = 'insert into post(user_id, title, memo, location, score, created_at) values (?, ?, ?, ?, ?, now())';
  conn.query(sql1, params1, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    var sql2 = 'select last_insert_id() as post_id';
    conn.query(sql2, function(err, results){
      if(err) {
        callback(err);
        return;
      }
      callback(null, results);
    });
  })
}

const detailPost = function(post_id, callback) {
  var params = [post_id];
  var sql = 'select * from post where post_id = ?';
  conn.query(sql, params, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
  })
}

const deletePost = function(post_id, callback) {
  var params = [post_id];
  var sql = 'delete from post where post_id = ?';
  conn.query(sql, params, function(err, results) {
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
  })
}

const userProfile = function(user_id, callback) {
  var params = [user_id];
  var sql = 'select user_id, profile_image from profile where user_id = ?';
  conn.query(sql, params, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
  })
}

const createTag = function(title, callback) {
  var params = [title];
  var sql = 'insert into tag(title) values (?)';
  conn.query(sql, params, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
  })
}

const getTagByTitle = function(title, callback) {
  var params = [title];
  var sql = 'select tag_id from tag where title = ?';
  conn.query(sql, params, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
  })
}

module.exports = {
  getPostIdByTitle,
  userPost,
  createPost,
  detailPost,
  deletePost,
  getPostImages,
  createPostImages,
  userProfile,
  createTag,
  getTagByTitle,
}