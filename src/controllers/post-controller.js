const userService = require('../service/user-service');
const ApiError = require('../exceptions/api-error');
const { Post, PostLike, Comment } = require('../../db/models');
const { where } = require('sequelize');

module.exports.create = async (req, res, next) => {
  try {
    const { header, body } = req.body.postData;
    console.log('title', header);
    console.log('content', body);
    const { refreshToken } = req.cookies;
    const userData = await userService.findUser(refreshToken);
    await Post.create({
      user_id: userData.user.id,
      header,
      body,
    });

    res.status(201).json({ message: 'Post created successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports.getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const posts = await Post.findAll({
      where: {
        user_id: id,
      },
      include: [PostLike, Comment],
    });

    console.log('posts', posts);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};
