const commentsRouter = require('express').Router();

const authMiddleware = require('../middlewares/auth-middlewares'); // middleware для тех, у кого есть токен

const {
  createComment,
  createCommentReply,
  setCommentLike,
} = require('../controllers/comments-controller');

module.exports = commentsRouter
  .post('/create/:post_id/', createComment)
  .post('/create/:post_id/:parent_comment_id', createCommentReply)
  .post('/set-like', setCommentLike);
