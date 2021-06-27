const Sequelize = require('sequelize');

const user = require('./user');
const profile = require('./profile');
const follow = require('./follow');
const post = require('./post');
const post_images = require('./post_images');
const post_likes = require('./post_likes');
const post_tags = require('./post_tags');
const tag = require('./tag');
const token = require('./token')

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.User = user;
db.Profile = profile;
db.Follow = follow;
db.Post = post;
db.PostImages = post_images;
db.PostLikes = post_likes;
db.PostTags = post_tags;
db.Tag = tag;
db.Token = token

Object.keys(db).forEach((modelName) => {
  db[modelName].init(sequelize);
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
