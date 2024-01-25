const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const { s3 } = require('./s3.js');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const maxSize = 100 * 1000 * 1000;

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.BUCKET_NAME,
    acl: 'public-read',
    metadata(req, file, cb) {
      console.log('Metadata:', file);
      cb(null, { fieldName: file.fieldname });
    },

    key(req, file, cb) {
      console.log('Key:', file);
      const folderName = req.folderName || 'default_folder';

      cb(
        null,
        `images/${folderName}/${uuidv4()}.${file.mimetype.split('/')[1]}`,
      );
    },
  }),
  limits: { fileSize: maxSize },
});

module.exports = {
  upload,
};
