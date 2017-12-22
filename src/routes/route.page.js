import express from 'express';
import config from '../config';
import PostModel from '../models/post';
import marked from 'marked';
import * as auth from '../middlewares/auth';

const router = express.Router();

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
  const { id } = req.query;

  PostModel.findOne({ _id: id }, function (err, post) {
    post.mkcontent = marked(post.content);
    res.render('show', { post });
  });
});

/* GET posts edit page. */
router.get('/posts/edit', auth.adminRequired, function (req, res, next) {
  const { id } = req.query;

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

export default router;
