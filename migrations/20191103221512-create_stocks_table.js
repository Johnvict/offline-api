"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("stocks", {
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
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("stocks");
  }
};
