const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Follow extends Model {
  static init(sequelize) {
    return super.init(
      {
        accept: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0
        }
      },
      {
        sequelize,
        modelName: 'Follow',
        tableName: 'follows',
        underscored: true,
        charset: 'utf8',
        collate: 'utf8_general_ci'
      }
    )
  }
  static associate(db) {
    db.Follow.belongsTo(db.User, {as: "Sender", foreignKey: "FollowSender"});
    db.Follow.belongsTo(db.User, {as: "Receiver", foreignKey: "FollowReceiver"});
  }
}