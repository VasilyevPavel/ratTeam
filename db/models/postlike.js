'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.Post, { foreignKey: 'post_id' });
    }
  }
  PostLike.init(
    {
      user_id: DataTypes.INTEGER,
      post_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'PostLike',
    },
  );
  return PostLike;
};
