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

const deletePostImages = function(post_id, callback) {
  var params = [post_id];
  var sql = 'delete from post_images where post_id = ?';
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

const createPostTag = function(tag_data, callback) {
  var post_id = tag_data.post_id;
  var tag = tag_data.tag
  var sqls = "";
  var sql = 'insert into post_tag(post_id, tag_id) values (?, ?);';
  for(var i=0; i<tag.length; i++){
    var arr = [];
    arr.push(post_id);
    arr.push(tag[i]);
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

const createTag = function(title, callback) {
  var params1 = [title];
  var sql1 = 'insert into tag(tag_title) values (?)';
  conn.query(sql1, params1, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    var sql2 = 'select last_insert_id() as tag_id';
    conn.query(sql2, function(err, results){
      if(err) {
        callback(err);
        return;
      }
      callback(null, results);
      return;
    });
  })
}

const getPostTags = function(post_id, callback) {
  var params = [post_id];
  var sql = 'select * from tag where tag_id = (select tag_id from post_tag where post_id = ?);'
  conn.query(sql, params, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
    return;
  })
}

const getTagIdByTitle = function(title, callback) {
  var params = [title];
  var sql = 'select tag_id from tag where tag_title = ?';
  conn.query(sql, params, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
  })
}

const feedPost = function(user_id, callback) {
  var params = [user_id];
  var sql = 'select * from post where user_id in (select follow_receiver from follow where follow_sender = ?)';
  conn.query(sql, params, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
    return;
  })
}

const getFeedPostImages = function(post_id, callback) {
  var params = [post_id];
  var sql = 'select * from post_images where post_id in (?)';

  conn.query(sql, params, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
    return;
  })
}

const getFeedUserProfile = function(user_id, callback) {
  var params = [user_id];
  var sql = 'select user_id, profile_image from profile where user_id in (?)';
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
  deletePostImages,
  userProfile,
  createPostTag,
  createTag,
  getTagIdByTitle,
  getPostTags,
  feedPost,
  getFeedPostImages,
  getFeedUserProfile
}