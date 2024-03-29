const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'userId' });
    }
  }
  Token.init({
    refreshToken: DataTypes.TEXT,
  }, {
    sequelize,
    tableName: 'tokens',
    modelName: 'Token',
  });
  return Token;
};
