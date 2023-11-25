const router = require('express').Router();
const authRouter = require('./auth.router');

module.exports = router.use('/auth', authRouter);
