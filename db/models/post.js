'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
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
      this.hasMany(models.Comment, { foreignKey: 'post_id' });
      this.hasMany(models.PostLike, { foreignKey: 'post_id' });
      this.hasMany(models.Image, { foreignKey: 'post_id' });
    }
  }
  Post.init(
    {
      header: DataTypes.STRING,
      body: DataTypes.STRING,
      isPosted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Post',
    },
  );
  return Post;
};
