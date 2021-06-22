const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class PostTags extends Model {
  static init(sequelize) {
    return super.init(
      {
  
      },
      {
        sequelize,
        modelName: 'PostTags',
        tableName: 'post_tags',
        timestamps: false,
        underscored: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    )
  }
  static associate(db) {
    db.PostTags.belongsTo(db.Post, {onDelete: 'CASCADE'});
    db.PostTags.belongsTo(db.Tag);
  }
}
