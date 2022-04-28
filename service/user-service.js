const bcrypt = require('bcrypt');
const { User } = require('../models');
const ApiError = require('../exceptions/api-error');

const tokenService = require('./token-service');

class UserService {
  async registration(email, password, name) {
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      throw ApiError.BadRequest('INVALID_EMAIL_REG');
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const newUser = await User.create({
      email: email.toLowerCase(),
      password: hashPassword,
      name,
    });
    const tokens = tokenService.generateTokens({ ...newUser.dataValues });
    await tokenService.saveToken(newUser.dataValues.id, tokens.refreshToken);

    return {
      expiresIn: process.env.ACCESS_LIVE_TIME,
      ...tokens,
      user: newUser.dataValues,
    };
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw ApiError.BadRequest('INVALID_EMAIL_LOG');
    }

    const isPassCorrect = await bcrypt.compare(password, user.password);
    if (!isPassCorrect) {
      throw ApiError.BadRequest('WRONG_PASS_LOG');
    }

    const tokens = tokenService.generateTokens({ ...user.dataValues });
    await tokenService.saveToken(user.id, tokens.refreshToken);

    return {
      expiresIn: process.env.ACCESS_LIVE_TIME,
      ...tokens,
      user,
    };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await User.findOne({ where: { id: userData.id } });
    const tokens = tokenService.generateTokens({ ...user.dataValues });
    await tokenService.saveToken(user.id, tokens.refreshToken);

    return {
      expiresIn: process.env.ACCESS_LIVE_TIME,
      ...tokens,
      user,
    };
  }

  async isEmailExists(email) {
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return true;
    }
    return false;
  }
}

module.exports = new UserService();
