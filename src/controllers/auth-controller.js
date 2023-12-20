const { validationResult } = require('express-validator');
const userService = require('../service/user-service');
const ApiError = require('../exceptions/api-error');
const { User } = require('../../db/models');
const {
  generateResetToken,
  validateResetToken,
} = require('../service/token-service');
const { sendResetPasswordMail } = require('../service/mail-service');

module.exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        ApiError.badRequestError('Ошибка при валидации', errors.array()),
      );
    }
    const { name, email, password } = req.body;
    const userData = await userService.registration(name, email, password);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.status(200).json(userData);
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const userData = await userService.login(email, password);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.status(200).json(userData);
  } catch (err) {
    next(err);
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const token = await userService.logout(refreshToken);
    res.clearCookie('refreshToken');
    return res.status(200).json(token);
  } catch (err) {
    next(err);
  }
};

module.exports.activate = async (req, res, next) => {
  try {
    const activationLink = req.params.link;
    console.log(activationLink);
    await userService.activate(activationLink);
    return res.redirect(process.env.CLIENT_URL);
  } catch (err) {
    console.log(err);
  }
};

module.exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const userData = await userService.refresh(refreshToken);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.status(200).json(userData);
  } catch (err) {
    next(err);
  }
};

module.exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userService.findByEmail(email);

    const resetToken = generateResetToken(user.id);
    console.log('resetToken', resetToken);
    await sendResetPasswordMail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`,
    );

    res
      .status(200)
      .json({ message: 'Инструкции по сбросу пароля отправлены на ваш email' });
  } catch (err) {
    next(err);
  }
};

module.exports.resetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    const userId = validateResetToken(resetToken);
    if (!userId) {
      throw ApiError.badRequestError('Некорректный токен сброса пароля');
    }

    const user = await userService.findById(userId);
    if (!user) {
      throw ApiError.notFoundError('Пользователь не найден');
    }

    // Обновить пароль пользователя в базе данных
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    await user.save();

    // Удалить использованный токен сброса пароля из базы данных (необходимо реализовать)
    // Пример использования: await tokenService.removeToken(resetToken);

    res.status(200).json({ message: 'Пароль успешно изменен' });
  } catch (err) {
    next(err);
  }
};
