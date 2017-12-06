var express = require('express');
var router = express.Router();
var PostModel = require('../models/post');
var errorHandle = require('../common/errorHandle');

/* GET users listing. */
router.get('/users', function (req, res, next) {
  res.send('respond with a resource');
});

/* GET 获取postList数据 */
router.get('/posts', function (req, res, next) {
  // res.json({postsList: ['文章1', '文章2', '文章3'] });
  PostModel.find({}, {}, function (err, posts) {
    if (err) {
      errorHandle(err, next);
    } else {
      res.json({ postsList: posts });
    }
  });
});

/* POST create posts */
router.post('/posts', function (req, res, next) {
  var title = req.body.title;
  var content = req.body.content;

  if ( title == '' || content =='') {
    return next(new Error("内容不能为空！"));
  }

  var post = new PostModel();
  post.title = title;
  post.content = content;
  post.save(function (err, doc) {
    if (err) {
      errorHandle(err, next);
    } else {
      res.json({post: doc}); // 注意这里
    }
  });
  // res.send({title, content}); //收到数据后，又把数据返回给了请求方
});

/* GET one psot */
router.get('/posts/:id', function (req, res, next) {
  var id = req.params.id;

  PostModel.findOne({ _id: id }, function (err, post) {
    if (err) {
      errorHandle(err, next);
    } else {
      res.json({ post });
    } 
  });
});

/* PATCH edit post */
router.patch('/posts/:id', function (req, res, next) {
  var id = req.params.id;
  var title = req.body.title;
  var content = req.body.content;

  PostModel.findOneAndUpdate({ _id: id }, { title, content }, function (err) {
    if (err) {
      errorHandle(err, next);
    } else {
      res.json({}); //不需要返回文章数据
    }
  });
});

module.exports = router;
