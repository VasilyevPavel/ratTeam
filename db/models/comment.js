'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
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
      this.hasMany(models.CommentLike, { foreignKey: 'comment_id' });
    }
  }
  Comment.init(
    {
      user_id: DataTypes.INTEGER,
      post_id: DataTypes.INTEGER,
      text: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Comment',
    },
  );
  return Comment;
};
