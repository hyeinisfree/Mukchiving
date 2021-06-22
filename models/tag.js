const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Tag extends Model {
  static init(sequelize) {
    return super.init(
      {
        tag_title: {
          type: DataTypes.STRING(15),
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'Tag',
        tableName: 'tags',
        charset: "utf8",
        collate: "utf8_general_ci", // 한글 저장
      }
    )
  }
  static associate(db) {
    
  }
}