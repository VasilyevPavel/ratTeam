const jwt = require('jsonwebtoken');
const { Token } = require('../../db/models');

module.exports = {
  generateTokens: (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });
    return {
      accessToken,
      refreshToken,
    };
  },

  saveToken: async (user_id, refreshToken) => {
    const tokenData = await Token.findOne({
      where: {
        user_id,
      },
    });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await Token.create({
      user_id,
      refreshToken,
    });
    return token;
  },

  removeToken: async (refreshToken) => {
    const tokenData = await Token.destroy({
      where: { refreshToken },
      raw: true,
    });

    return tokenData;
  },
  findToken: async (refreshToken) => {
    const tokenData = await Token.findOne({
      where: { refreshToken },
      raw: true,
    });

    return tokenData;
  },

  validateAccessToken: async (token) => {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  validateRefrshToken: async (token) => {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (error) {
      console.log(error);
    }
  },
  generateResetToken: (userId) => {
    const resetToken = jwt.sign(
      { userId },
      process.env.JWT_RESET_TOKEN_SECRET,
      {
        expiresIn: '1h',
      },
    );
    return resetToken;
  },

  validateResetToken: (resetToken) => {
    try {
      const decodedToken = jwt.verify(
        resetToken,
        process.env.RESET_TOKEN_SECRET,
      );
      return decodedToken.userId;
    } catch (err) {
      return null;
    }
  },
};
