const { PostImage, CommentImage } = require('../../db/models');
const { deletePhoto } = require('../lib/s3');

module.exports.uploadPostPhoto = async (req, res, next) => {
  try {
    const { files } = req;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files provided' });
    }

    const images = await Promise.all(
      files.map(async (file) => {
        const image = await PostImage.create({ name: file.key });
        return image;
      }),
    );

    res.status(201).json(images);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports.uploadCommentPhoto = async (req, res, next) => {
  try {
    const { file } = req;

    if (!file || file.length === 0) {
      return res.status(400).json({ message: 'No files provided' });
    }

    const image = await CommentImage.create({ name: file.key });

    res.status(201).json(image);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports.getPostPhotos = async (req, res, next) => {
  try {
    const { id } = req.params;

    const images = await PostImage.findAll({
      where: { post_id: id },
      raw: true,
    });

    res.status(200).json(images);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports.updateImage = async (req, res, next) => {
  try {
    const { postId, imageId } = req.params;

    const image = await PostImage.findOne({
      where: { id: imageId },
      raw: true,
    });
    await image.update({ post_id: postId });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports.deletePhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const image = await PostImage.findOne({ where: { id }, raw: true });

    const name = image.name.match(/\/([^\/]+)$/)[1];

    await deletePhoto(image.name);
    await PostImage.destroy({ where: { id } });
    res.status(200).json({ message: 'Фото удалено' });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
