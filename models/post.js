const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      User, Like, Tag, PostsTags,
    }) {
      this.belongsTo(User, { foreignKey: 'userId' });
      this.hasMany(Like, { foreignKey: 'postId' });
      this.belongsToMany(Tag, { through: PostsTags });
    }
  }
  Post.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    author: DataTypes.STRING,
    imageSource: DataTypes.STRING,
    likeCounter: DataTypes.INTEGER,
    tags: DataTypes.ARRAY(DataTypes.STRING),
  }, {
    sequelize,
    tableName: 'posts',
    modelName: 'Post',
  });
  return Post;
};
