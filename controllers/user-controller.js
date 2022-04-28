const { validationResult } = require('express-validator');
const userService = require('../service/user-service');
const ApiError = require('../exceptions/api-error');

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        next(ApiError.BadRequest('Error validation', errors.array()));
      }

      const { email, password, name } = req.body;
      const userData = await userService.registration(email, password, name);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        next(ApiError.BadRequest('Error validation', errors.array()));
      }
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const tokenData = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(tokenData);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  getCurrentUserEmail(req, res, next) {
    try {
      const { id, name, email } = req.user;
      return res.json({ id, name, email });
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async isEmailExists(req, res, next) {
    try {
      const { email } = req.body;
      const isEmailExists = await userService.isEmailExists(email);
      return res.json({ isEmailExists });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
