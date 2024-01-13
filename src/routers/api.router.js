const router = require('express').Router();
const authRouter = require('./auth.router');
const postRouter = require('./post.router');

module.exports = router.use('/auth', authRouter);
module.exports = router.use('/post', postRouter);
