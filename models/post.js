const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Post extends Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: DataTypes.STRING(20),
          allowNull: false
        },
        memo: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        location: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        score: {
          type: DataTypes.FLOAT,
          allowNull: true
        },
      },
      {
        sequelize,
        modelName: "Post",
        tableName: "posts",
        underscored: true,
        charset: "utf8",
        collate: "utf8_general_ci", // 한글 저장
      }
    )
  }
  static associate(db) {
    db.Post.belongsTo(db.User, {onDelete: 'CASCADE'});
  }
}