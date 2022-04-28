const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class like extends Model {
    static associate({ User, Post }) {
      this.belongsTo(User, { foreignKey: 'userId' });
      this.belongsTo(Post, { foreignKey: 'postId' });
    }
  }
  like.init({
    userId: DataTypes.STRING,
    postId: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'likes',
    modelName: 'Like',
  });
  return like;
};
