const { Comment, CommentLike } = require('../../db/models');
const userService = require('../service/user-service');

module.exports.createComment = async (req, res, next) => {
  try {
    const { post_id, parent_comment_id } = req.params;
    const { text } = req.body;
    const { refreshToken } = req.cookies;
    const userData = await userService.findUser(refreshToken);
    if (parent_comment_id) {
      const comment = await Comment.create({
        user_id: userData.user.id,
        post_id,
        parent_comment_id,
        text,
      });
      res.status(200).json(comment);
    } else {
      const comment = await Comment.create({
        user_id: userData.user.id,
        post_id,
        text,
      });
      res.status(200).json(comment);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports.createCommentReply = async (req, res, next) => {
  try {
    const { post_id, parent_comment_id } = req.params;
    const { text } = req.body;
    const { refreshToken } = req.cookies;
    const userData = await userService.findUser(refreshToken);
    const comment = await Comment.create({
      user_id: userData.user.id,
      post_id,
      text,
      parent_comment_id,
    });
    res.status(200).json(comment);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports.setCommentLike = async (req, res, next) => {
  try {
    const { userId, commentId } = req.body;

    const commentExist = await Comment.findByPk(commentId);
    if (!commentExist) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const { refreshToken } = req.cookies;
    const userData = await userService.findUser(refreshToken);

    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingLike = await CommentLike.findOne({
      where: {
        user_id: userData.user.id,
        comment_id: commentId,
      },
    });

    if (!existingLike) {
      await CommentLike.create({
        user_id: userData.user.id,
        comment_id: commentId,
      });
      res.status(200).json({ message: 'Like added successfully' });
    } else {
      await existingLike.destroy();
      res.status(200).json({ message: 'Like removed successfully' });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};
