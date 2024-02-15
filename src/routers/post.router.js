const postRouter = require('express').Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middlewares'); // middleware для тех, у кого есть токен

const {
  create,
  getUserPosts,

  getAllPosts,
  getOnePost,

  update,
  setPostLike,
} = require('../controllers/post-controller');
const setFolderName = require('../middlewares/setFolderName');
const upload = require('../lib/multer');

module.exports = postRouter
  .post('/create', create)
  .patch(`/update/:id`, update)
  .get('/get-posts/:id', getUserPosts)
  .post('/set-like', setPostLike)
  .get('/get-all-posts', getAllPosts)
  .get('/get-post/:postId', getOnePost);
