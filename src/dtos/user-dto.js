module.exports.createUserDto = (model) => ({
  id: model.id,
  name: model.name,
  email: model.email,
  isActivated: model.isActivated,
  isAdmin: model.isAdmin,
  avatar: model.avatar,
});
