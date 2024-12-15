const imageRouter = require('express').Router();

const setFolderName = require('../middlewares/setFolderName');
const { upload } = require('../lib/multer');
const {
  uploadPostPhoto,
  deletePhoto,
  updateImage,
  getPostPhotos,
  uploadCommentPhoto,
  deleteCommentPhoto,
} = require('../controllers/image-controller');

module.exports = imageRouter
  .post(
    '/upload-post-photo',
    setFolderName('post'),
    upload.array('photos', 12),
    uploadPostPhoto,
  )
  .post(
    '/upload-comment-photo',
    setFolderName('comment'),
    upload.single('photo'),
    uploadCommentPhoto,
  )
  .delete('/delete-comment-photo/:id', deleteCommentPhoto)
  .get('/get-post-photos/:id', getPostPhotos)
  .put('/update-post-image/:postId/imageId', updateImage)
  .delete('/delete-post-photo/:id', deletePhoto);
