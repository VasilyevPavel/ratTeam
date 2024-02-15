'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommentImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Comment, { foreignKey: 'comment_id' });
    }
  }
  CommentImage.init(
    {
      name: DataTypes.STRING,
      comment_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'CommentImage',
    },
  );
  return CommentImage;
};
