const postRouter = require('express').Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middlewares'); // middleware для тех, у кого есть токен

const {
  create,
  getUserPosts,
  setLike,
  getAllPosts,
  getOnePost,
} = require('../controllers/post-controller');

module.exports = postRouter
  .post('/create', create)
  .get('/get-posts/:id', getUserPosts)
  .post('/set-like', setLike)
  .get('/get-all-posts', getAllPosts)
  .get('/get-post/:postId', getOnePost);
