import express from 'express';
import PostModel from '../models/post';
import errorHandle from '../common/errorHandle';
import bcrypt from 'bcrypt';
import UserModel from '../models/user';
import config from '../config';
import * as auth from '../middlewares/auth';
import jwt from 'jwt-simple';
import moment from 'moment';

const router = express.Router();

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

/* POST create post */
router.post('/posts', function (req, res, next) {
  const { title, content } = req.body;

  if (title == '' || content == '') {
    return next(new Error("内容不能为空！"));
  }

  const post = new PostModel();
  post.title = title;
  post.content = content;
  post.authorId = res.locals.currentUser._id;
  post.save(function (err, doc) {
    if (err) {
      errorHandle(err, next);
    } else {
      res.json({ post: doc }); // 注意这里
    }
  });
  // res.send({title, content}); //收到数据后，又把数据返回给了请求方
});

/* GET one psot */
router.get('/posts/:id', function (req, res, next) {
  const id = req.params.id;

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
  const { id, title, content } = req.params;

  PostModel.findOneAndUpdate({ _id: id }, { title, content }, function (err) {
    if (err) {
      errorHandle(err, next);
    } else {
      res.json({}); //不需要返回文章数据
    }
  });
});

/* POST signup user */
router.post('/signup', function(req, res, next) {
  const { name, pass, rePass } = req.body;

  if (name == '' || pass == '') {
    return errorHandle(new Error("帐号和密码不能为空！"), next);
  }

  if (pass !== rePass) {
    return errorHandle(new Error('两次密码不对'), next);
  }

  const user = new UserModel();
  user.name = name;
  user.pass = bcrypt.hashSync(pass, 10);
  user.save(function(err) {
    if (err) {
      next(err);
    } else {
      res.end();
    }
  });
});

/* POST signin user */
router.post('/signin', function(req, res, next) {
  const { name, pass } = req.body;

  UserModel.findOne({ name }, function(err, user) {
    if (err || !user) {
      return next(new Error('用户名或密码错误'));
    } else {
      const isOk = bcrypt.compareSync(pass, user.pass);
      if (!isOk) {
        return next(new Error('用户名或密码错误'));
      }

      const token = jwt.encode(
        {
          _id: user._id,
          name: user.name,
          isAdmin: user.loginname === config.admin,
          exp: moment().add('days', 30).valueOf(),
        },
        config.jwtSecret
      );

      const opts = {
        path: '/',
        maxAge: moment().add('days', 30).valueOf(), // cookie 有效期30天
        signed: true,
        httpOnly: true
      };

      res.cookie(config.cookieName, token, opts);
      res.json({ token });
    }
  });
});

export default router;
