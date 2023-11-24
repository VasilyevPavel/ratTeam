const { validationResult } = require('express-validator');
const userService = require('../service/user-service');
const ApiError = require('../exceptions/api-error');

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

module.exports.users = async (req, res, next) => {
  try {
    res.json({ message: 'Удача' });
  } catch (err) {
    next(err);
  }
};
