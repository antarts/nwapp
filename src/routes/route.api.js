import express from 'express';
import * as auth from '../middlewares/auth';
import * as post from '../controllers/post';
import * as user from '../controllers/user';

const router = express.Router();

/* GET users listing. */
router.get('/users', user.more);

/* GET 获取postList数据 */
router.get('/posts', post.more);

/* POST create post */
router.post('/posts', auth.adminRequired, post.create);

/* GET one psot */
router.get('/posts/:id', post.one);

/* PATCH edit post */
router.patch('/posts/:id', auth.adminRequired, post.update);

/* POST signup user */
router.post('/signup', user.signup);

/* POST signin user */
router.post('/signin', user.signin);

export default router;
