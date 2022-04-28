const { Router } = require('express');

const router = new Router();
const { body } = require('express-validator');

const passport = require('passport');
const authMiddleware = require('../middlewares/auth-middleware');
const userController = require('../controllers/user-controller');

router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  userController.registration,
);
router.post(
  '/login',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  userController.login,
);

router.post('/checkEmailExistens', userController.isEmailExists);
router.post('/logout', userController.logout);
router.post('/google', passport.authenticate('google-token', { session: false }));
router.get('/refresh', userController.refresh);
router.get('/currentUser', authMiddleware, userController.getCurrentUserEmail);

module.exports = router;
