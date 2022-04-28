module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      content: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      author: {
        allowNull: false,
        type: DataTypes.STRING,

      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      imageSource: {
        type: DataTypes.STRING,
      },
      likeCounter: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('posts');
  },
};
