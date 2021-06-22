const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        user_id: {
          type: DataTypes.STRING(10),
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING(72),
          allowNull: true
        },
        phone: {
          type: DataTypes.STRING(11),
          allowNull: false,
          unique: true
        },
        permission: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        privacy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1
        }
      }, 
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci'
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Post);
  }
};
