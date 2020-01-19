const Sequelize = require('sequelize');
const Model = Sequelize.Model;


class Stock extends Model { }
Stock.init(
  {
      id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
      },
      item_id: {
        type: Sequelize.INTEGER(11),
        references: {
			model: "items",
			key: "id"
        }
	},
      client_id: {
        type: Sequelize.INTEGER(11),
        references: {
			model: "clients",
			key: "id"
        }
	},
	count: Sequelize.INTEGER,
	price: Sequelize.FLOAT(),
	discount: {
		type: Sequelize.FLOAT(),
		defaultValue: 0
	},
	createdAt: Sequelize.DATE,
	updatedAt: Sequelize.DATE
  },
  {
	sequelize,
    modelName: "stocks"
  }
);

module.exports = Stock;
