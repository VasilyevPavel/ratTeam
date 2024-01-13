const bcrypt = require('bcrypt');
const uuid = require('uuid');
const { createUserDto } = require('../dtos/user-dto');
const { User } = require('../../db/models');
const { sendActivationMail } = require('./mail-service');
const {
  generateTokens,
  saveToken,
  removeToken,
  validateAccessToken,
  validateRefrshToken,
  findToken,
} = require('./token-service');
const ApiError = require('../exceptions/api-error');
const mailService = require('./mail-service');

module.exports.registration = async (name, email, password) => {
  const candidate = await User.findOne({
    where: {
      email,
    },
    raw: true,
  });

  if (candidate) {
    throw ApiError.badRequestError('Такой пользователь уже существует');
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const activationLink = uuid.v4();
  const user = await User.create({
    name,
    email,
    activationLink,
    password: hashPassword,
  });

  await sendActivationMail(
    email,
    `${process.env.API_URL}/api/auth/activate/${activationLink}`,
  );

  const userDto = createUserDto(user);
  const tokens = generateTokens({ ...userDto });
  await saveToken(userDto.id, tokens.refreshToken);

  return {
    ...tokens,
    user: userDto,
  };
};
module.exports.activate = async (activationLink) => {
  const user = await User.findOne({ where: { activationLink } });
  if (!user) {
    throw ApiError.badRequestError('Некорректная ссылка активации');
  }
  user.isActivated = true;
  await user.save();
};

module.exports.login = async (email, password) => {
  const user = await User.findOne({ where: { email }, raw: true });
  console.log('Юзер', user);
  if (!user) {
    throw ApiError.badRequestError('Пользователь не найден');
  }
  const isPassEquals = await bcrypt.compare(password, user.password);
  if (!isPassEquals) {
    throw ApiError.badRequestError('Пароль не правильный');
  }
  const userDto = createUserDto(user);
  console.log('dto', userDto);
  const tokens = generateTokens({ ...userDto });
  await saveToken(userDto.id, tokens.refreshToken);
  return {
    ...tokens,
    user: userDto,
  };
};

module.exports.logout = async (refreshToken) => {
  const token = await removeToken(refreshToken);
  return token;
};

module.exports.refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw ApiError.unauthorizedError();
  }

  const userData = await validateRefrshToken(refreshToken);
  const tokenFromDb = await findToken(refreshToken);

  if (!userData || !tokenFromDb) {
    throw ApiError.unauthorizedError();
  }
  const user = await User.findByPk(userData.id);
  const userDto = createUserDto(user);
  const tokens = generateTokens({ ...userDto });
  await saveToken(userDto.id, tokens.refreshToken);

  return {
    ...tokens,
    user: userDto,
  };
};
module.exports.findUser = async (refreshToken) => {
  if (!refreshToken) {
    throw ApiError.unauthorizedError();
  }
  const userData = await validateRefrshToken(refreshToken);
  const tokenFromDb = await findToken(refreshToken);

  if (!userData || !tokenFromDb) {
    throw ApiError.unauthorizedError();
  }
  const user = await User.findByPk(userData.id);
  const userDto = createUserDto(user);
  return {
    user: userDto,
  };
};
module.exports.findByEmail = async (email) => {
  const user = await User.findOne({ where: { email }, raw: true });

  if (!user) {
    throw ApiError.badRequestError('Пользователь не найден');
  }

  return user;
};

module.exports.findByIdAndChangePassword = async (id, password) => {
  const user = await User.findOne({ where: { id } });
  if (!user) {
    throw ApiError.badRequestError('Пользователь не найден');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  user.password = hashPassword;
  await user.save();

  return user;
};
