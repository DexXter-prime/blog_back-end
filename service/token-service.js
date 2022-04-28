const jwt = require('jsonwebtoken');
const { Token } = require('../models');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.TOKEN_ACCESS_SECRET, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, process.env.TOKEN_REFRESH_SECRET, { expiresIn: '2h' });
    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccesToken(token) {
    try {
      const userData = jwt.verify(token, process.env.TOKEN_ACCESS_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.TOKEN_REFRESH_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    const userToken = await Token.findOne({ where: { userId } });
    if (userToken) {
      return Token.update({ refreshToken }, { where: { userId } });
    }

    const token = await Token.create({ userId, refreshToken });
    return token;
  }

  async removeToken(refreshToken) {
    const tokenData = await Token.destroy({ where: { refreshToken } });
    return tokenData;
  }

  async findToken(refreshToken) {
    const userToken = await Token.findOne({ where: { refreshToken } });
    return userToken;
  }
}

module.exports = new TokenService();
