const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class Location extends Model {}
Location.init(
  {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    cordinateLong: Sequelize.STRING(10),
    cordinateLat: Sequelize.STRING(10),
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  },
  {
    sequelize,
    modelName: "locations"
  }
);


module.exports = Location;
