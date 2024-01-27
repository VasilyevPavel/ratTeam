const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.Token, { foreignKey: 'user_id' });
      this.hasMany(models.PostLike, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
      this.hasMany(models.CommentLike, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
      this.hasMany(models.Comment, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
      this.hasMany(models.Post, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      isActivated: DataTypes.BOOLEAN,
      isAdmin: DataTypes.BOOLEAN,
      avatar: DataTypes.TEXT,
      activationLink: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};
