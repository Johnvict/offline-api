const Sequelize = require('sequelize');
const PROTECTED_ATTRIBUTES = require('./../middleware/validator').protected;
const Model = Sequelize.Model;


class User extends Model {
  toJSON () {
    // hide protected fields
    let attributes = Object.assign({}, this.get())
    for (let a of PROTECTED_ATTRIBUTES) {
      delete attributes[a]
    }
    return attributes
  }
}
User.init(
  {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    client_id: {
      type: Sequelize.INTEGER(11),
      references: {
        model: "clients",
        key: "id"
      }
    },
    location_id: {
      type: Sequelize.INTEGER(11),
      references: {
        model: "locations",
        key: "id"
      }
    },
    username: {
      type: Sequelize.STRING(30),
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING(200),
      allowNull: false
    },
    address: {
      type: Sequelize.STRING(200),
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING(12),
      allowNull: false,
      unique: true
    },

    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  },
  {
    sequelize,
    modelName: "users"
  }
);

// User.belongsTo(Client);

module.exports = User;

// User.hasMany(Logs, {
//   as: "user",
//   foreignKey: "user_id",
//   constraints: false
// });
// User.hasMany(ItemCategory, {
//   as: "user",
//   foreignKey: "user_id",
//   constraints: false
// });

// username: {
//   type: Sequelize.STRING,
//   allowNull: false,
//   unique: true,
//   allowNull: true,
//   defaultValue: null
// },
