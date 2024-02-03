const { Comment } = require('../../db/models');
const userService = require('../service/user-service');

module.exports.createComment = async (req, res, next) => {
  try {
    const { post_id } = req.params;
    const { text } = req.body;
    const { refreshToken } = req.cookies;
    const userData = await userService.findUser(refreshToken);
    const comment = await Comment.create({
      user_id: userData.user.id,
      post_id,
      text,
    });
    res.status(200).json(comment);
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
