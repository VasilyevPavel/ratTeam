const postRouter = require('express').Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middlewares'); // middleware для тех, у кого есть токен

const { create, getUserPosts } = require('../controllers/post-controller');

module.exports = postRouter
  .post('/create', create)
  .get('/get-posts/:id', getUserPosts);
