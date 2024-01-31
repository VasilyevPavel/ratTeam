const imageRouter = require('express').Router();

const setFolderName = require('../middlewares/setFolderName');
const { upload } = require('../lib/multer');
const {
  uploadPhoto,
  deletePhoto,
  updateImage,
  getPostPhotos,
} = require('../controllers/image-controller');

module.exports = imageRouter
  .post(
    '/upload-photo',
    setFolderName('post'),
    upload.array('photos', 12),
    uploadPhoto,
  )
  .get('/get-post-photos/:id', getPostPhotos)
  .put('/update-image/:postId/imageId', updateImage)
  .delete('/delete-photo/:id', deletePhoto);
