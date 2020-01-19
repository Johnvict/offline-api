const Sequelize = require('sequelize');
const User = require("./User");
const Location = require('./Location');
const PROTECTED_ATTRIBUTES = require('./../middleware/validator').protected;
const Model = Sequelize.Model;


class Client extends Model {
  toJSON () {
    // hide protected fields
    let attributes = Object.assign({}, this.get())
    for (let a of PROTECTED_ATTRIBUTES) {
      delete attributes[a]
	}
	// attributes.itemClasses.forEach(itemClass => {
	// 	itemClass.itemCategories.forEach(itemCategory => {
	// 		itemCategory.items.forEach(item => {
	// 			item.stocks = item.stocks.filter(stock => stock.client_id == attributes.id)
	// 		})
	// 	})	
	// })
	console.table(attributes.id);
    return attributes
  }
}

Client.init(
  {
      id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
      },
      location_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "locations",
          key: "id"
        }
      },
      business_name: Sequelize.STRING(200),
      short_name: Sequelize.STRING(50),
      address: Sequelize.STRING(200),
      phone: {
        type: Sequelize.STRING(12),
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
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
  },
  {
	sequelize,
    modelName: "clients"
  }
);


// Client.hasMany(User, {
// 	as: "client",
// 	foreignKey: "client_id",
// 	constraints: false
// });
// Client.belongsTo(Location, { foreignKey: 'location_id'});
// Client.hasMany(ItemCategory, {
// 	as: "client",
// 	foreignKey: "client_id",
// 	constraints: false
// });

module.exports = Client;
