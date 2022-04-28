const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PostsTags extends Model {
    static associate({ Tag, Post }) {
      this.belongsTo(Post, { foreignKey: 'postId' });
      this.belongsTo(Tag, { foreignKey: 'tagId' });
    }
  }
  PostsTags.init({
    postId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: 'posts_tags',
    modelName: 'PostsTags',
  });
  return PostsTags;
};
