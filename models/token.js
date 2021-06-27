const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Token extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          onDelete: 'CASCADE',
          references: {
          model: 'users',
          key: 'id',
          },
        },
        token: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'Token',
        tableName: 'tokens',
        timestamps: false,
        charset: "utf8",
        collate: "utf8_general_ci", // 한글 저장
      }
    )
  }
  static associate(db) {
    
  }
}