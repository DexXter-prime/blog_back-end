const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post, PostsTags }) {
      this.belongsToMany(Post, { through: PostsTags });
    }
  }
  Tag.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'tags',
    modelName: 'Tag',
  });
  return Tag;
};
