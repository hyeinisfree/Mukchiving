const { IoTSecureTunneling } = require("aws-sdk");
const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Profile extends Model {
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
        username: {
          type: DataTypes.STRING(20),
          allowNull: false,
          unique: true
        },
        profile_image: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: 'Profile',
        tableName: 'profiles',
        timestamps: false,
        underscored: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }
  static associate(db) {

  }
};
