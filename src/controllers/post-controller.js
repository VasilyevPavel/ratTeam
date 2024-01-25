const userService = require('../service/user-service');
const ApiError = require('../exceptions/api-error');
const { Post, PostLike, Comment, User, Image } = require('../../db/models');

module.exports.create = async (req, res, next) => {
  try {
    const { header, body } = req.body.postData;

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
      include: [PostLike, Comment, User],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};
module.exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: [PostLike, Comment, User],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};
module.exports.getOnePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    console.log('postId', postId);
    const post = await Post.findOne({
      where: {
        id: postId,
      },
      include: [PostLike, Comment, User],
    });
    // if (!post) {
    //   res.status(200).json('Нет такого поста');
    // }
    // console.log('post', post);
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

module.exports.setLike = async (req, res, next) => {
  try {
    const { userId, postId } = req.body;

    const postExists = await Post.findByPk(postId);
    if (!postExists) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userExists = await User.findByPk(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingLike = await PostLike.findOne({
      where: {
        user_id: userId,
        post_id: postId,
      },
    });

    if (!existingLike) {
      await PostLike.create({
        user_id: userId,
        post_id: postId,
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
