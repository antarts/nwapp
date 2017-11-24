var express = require('express');
var router = express.Router();
var PostModel = require('../models/post');

/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET 获取postList数据 */
router.get('/posts', function(req, res, next) {
  // res.json({postsList: ['文章1', '文章2', '文章3'] });
  PostModel.find({}, {}, function (err, posts) {
    if (err) {
      res.json({ success: false });
    } else {
      res.json({ success: true, postsList: posts });
    }
  });
});

/* POST create posts */
router.post('/posts/create', function(req, res, next) {
  var title = req.body.title;
  var content = req.body.content;

  var post = new PostModel();
  post.title = title;
  post.content = content;
  post.save(function (err) {
    if (err) {
      res.json({success: false});
    } else {
      res.json({success: true});
    }
  });
  // res.send({title, content}); //收到数据后，又把数据返回给了请求方
} );

module.exports = router;
