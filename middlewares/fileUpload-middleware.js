const multer = require('multer');
const path = require('path');

const imageUploadConfig = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'static/images');
  },
  filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const multerUploader = multer({ storage: imageUploadConfig });
const upload = multerUploader.single('image');
module.exports = upload;
