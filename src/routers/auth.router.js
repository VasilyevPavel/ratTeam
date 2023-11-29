const authRouter = require('express').Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middlewares'); // middleware для тех, у кого есть токен

const {
  register,
  login,
  logout,
  activate,
  refresh,
  users,
  test,
} = require('../controllers/auth-controller');

module.exports = authRouter
  .post(
    '/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    register,
  )
  .post('/login', login)
  .post('/logout', logout)
  .get('/activate/:link', activate)
  .get('/refresh', refresh)
  .get('/users', authMiddleware, users)
  .get('/test', test);
