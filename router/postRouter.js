const { Router } = require('express');

const router = new Router();
const { body } = require('express-validator');

const fileUploader = require('../middlewares/fileUpload-middleware');

const postController = require('../controllers/post-controller');
const authMiddleware = require('../middlewares/auth-middleware');

router.get('/all', postController.getAllPosts);
router.get('/all/:tagname', postController.getAllPostsByTagName);
router.get('/:id', authMiddleware, postController.getOnePost);
router.post('/post/:id', authMiddleware, postController.isLikeExists);

router.post(
  '/create',
  authMiddleware,
  body('title').isEmpty().isLength({ max: 15 }),
  body('content').isEmpty().isLength({ min: 10 }),
  fileUploader,

  postController.createPost,
);

router.delete('/delete/:id', authMiddleware, postController.deletePost);

router.put(
  '/update/:id',
  authMiddleware,
  body('title').isEmpty().isLength({ max: 15 }),
  body('content').isEmpty().isLength({ min: 10 }),
  fileUploader,

  postController.updatePost,
);

module.exports = router;
