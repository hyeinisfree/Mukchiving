const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class PostLikes extends Model {
  static init(sequelize) {
    return super.init(
      {
        
      },
      {
        sequelize,
        modelName: 'PostLikes',
        tableName: 'post_likes',
        timestamps: false,
        underscored: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    )
  }
  static associate(db) {
    db.PostLikes.belongsTo(db.User);
    db.PostLikes.belongsTo(db.Post, {onDelete: 'CASCADE'});
  }
}