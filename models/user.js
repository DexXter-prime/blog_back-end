const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Token, Post, Like }) {
      this.hasOne(Token, { foreignKey: 'userId' });
      this.hasMany(Post, { foreignKey: 'userId' });
      this.hasMany(Like, { foreignKey: 'userId' });
    }
  }
  User.init({
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'User',
  });
  return User;
};
