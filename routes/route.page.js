var express = require('express');
var router = express.Router();
var config = require('../config');
var PostModel = require('../models/post');
var marked = require('marked');
var auth = require('../middlewares/auth');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Index page.' });
});

/* GET posts page. */
router.get('/posts', function (req, res, next) {
  res.render('posts', { title: 'post page.' });
});

/* GET posts create page. */
router.get('/posts/create', auth.adminRequired, function(req, res, next) {
  res.render('create');
});

/* GET show post page */
router.get('/posts/show', function (req, res, next) {
  var id = req.query.id;

  PostModel.findOne({ _id: id }, function (err, post) {
    post.mkcontent = marked(post.content);
    res.render('show', { post });
  });
});

/* GET posts edit page. */
router.get('/posts/edit', auth.adminRequired, function (req, res, next) {
  var id = req.query.id;

  res.render('edit', { id });
});

/* GET signup page. */
router.get('/signup', function (req, res, next) {
  res.render('signup');
});

/* GET signin page. */
router.get('/signin', function (req, res, next) {
  res.render('signin');
});

/* GET signout */
router.get('/signout', function (req, res, next) {
  res.clearCookie(config.cookieName, { path: '/' });
  res.redirect('/');
});

module.exports = router;
