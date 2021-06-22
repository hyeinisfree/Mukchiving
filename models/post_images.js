const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class PostImages extends Model {
  static init(sequelize) {
    return super.init(
      {
        image_url: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
      },
      {
        sequelize,
        modelName: 'PostImages',
        tableName: 'post_images',
        timestamps: false,
        underscored: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    )
  }
  static associate(db) {
    db.PostImages.belongsTo(db.Post, {onDelete: 'CASCADE'});
  }
}
