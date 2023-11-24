const authRouter = require('./auth.router');

const router = require('express').Router();

module.exports = router.use('/auth', authRouter);