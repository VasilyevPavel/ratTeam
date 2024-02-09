'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommentLike extends Model {
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

      this.belongsTo(models.Comment, {
        foreignKey: 'comment_id',
        onDelete: 'CASCADE',
      });
    }
  }
  CommentLike.init(
    {
      user_id: DataTypes.INTEGER,
      comment_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'CommentLike',
    },
  );
  return CommentLike;
};
