const { Image } = require('../../db/models');
const { deletePhoto } = require('../lib/s3');

module.exports.uploadPhoto = async (req, res, next) => {
  try {
    const { files } = req;
    console.log('загрузка фоток', files);

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files provided' });
    }

    const images = await Promise.all(
      files.map(async (file) => {
        const image = await Image.create({ name: file.key });
        return image;
      }),
    );

    res.status(201).json(images);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
module.exports.updateImage = async (req, res, next) => {
  try {
    const { postId, imageId } = req.params;

    const image = await Image.findOne({ where: { id: imageId }, raw: true });
    await image.update({ post_id: postId });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports.deletePhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const image = await Image.findOne({ where: { id }, raw: true });

    const name = image.name.match(/\/([^\/]+)$/)[1];

    await deletePhoto(image.name);
    await Image.destroy({ where: { id } });
    res.status(200).json({ message: 'Фото удалено' });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
