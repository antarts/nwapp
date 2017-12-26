import marked from 'marked';
import bcrypt from 'bcrypt';
import config from '../config';
import PostModel from '../models/post';

/* GET home page. */
export const homePage = function (req, res, next) {
    res.render('index', { title: 'Index page.' });
};

/* GET posts page. */
export const postsPage = function (req, res, next) {
    res.render('posts', { title: 'post page.' });
};

/* GET posts create page. */
export const createPage = function (req, res, next) {
    res.render('create');
};

/* GET show post page */
export const showPage = function (req, res, next) {
    const { id } = req.query;

    PostModel.findOne({ _id: id }, function (err, post) {
        post.mkcontent = marked(post.content);
        res.render('show', { post });
    });
};

/* GET posts edit page. */
export const editPage = function (req, res, next) {
    const { id } = req.query;

    res.render('edit', { id });
};

/* GET signup page. */
export const signupPage = function (req, res, next) {
    res.render('signup');
};

/* GET signin page. */
export const signinPage = function (req, res, next) {
    res.render('signin');
};

/* GET signout */
export const signoutPage = function (req, res, next) {
    res.clearCookie(config.cookieName, { path: '/' });
    res.redirect('/');
};