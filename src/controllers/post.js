import PostModel from '../models/post';
import UserModel from '../models/user';
import config from '../config';
import errorHandle from '../common/errorHandle';

export const more = function (req, res, next) {
    // res.json({postsList: ['文章1', '文章2', '文章3'] });
    PostModel.find({}, {}, function (err, posts) {
        if (err) {
            errorHandle(err, next);
        } else {
            res.json({ postsList: posts });
        }
    });
};

export const one = function (req, res, next) {
    const id = req.params.id;

    PostModel.findOne({ _id: id }, function (err, post) {
        if (err) {
            errorHandle(err, next);
        } else {
            res.json({ post });
        }
    });
};

export const create = function (req, res, next) {
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
};

export const update = function (req, res, next) {
    const { id, title, content } = req.params;
  
    PostModel.findOneAndUpdate({ _id: id }, { title, content }, function (err) {
      if (err) {
        errorHandle(err, next);
      } else {
        res.json({}); //不需要返回文章数据
      }
    });
  };