import bcrypt from 'bcrypt';
import PostModel from '../models/post';
import UserModel from '../models/user';
import config from '../config';
import jwt from 'jwt-simple';
import moment from 'moment';
import errorHandle from '../common/errorHandle';

export const signup = function (req, res, next) {
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
    user.save(function (err) {
        if (err) {
            next(err);
        } else {
            res.end();
        }
    });
};

export const signin = function (req, res, next) {
    const { name, pass } = req.body;

    UserModel.findOne({ name }, function (err, user) {
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
};

export const more = function (req, res, next) {
    res.send('respond with a resource');
};