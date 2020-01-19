"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("transaction_logs", {
      id: {
        type: Sequelize.INTEGER(11),
		primaryKey: true,
        autoIncrement: true
      },
      token: Sequelize.STRING(50),
      item_class_id: {
        type: Sequelize.INTEGER(11),
        references: {
          model: "item_classes",
          key: "id"
        }
      },
      item_category_id: {
        type: Sequelize.INTEGER(11),
        references: {
          model: "item_categories",
          key: "id"
        }
      },
      item_id: {
        type: Sequelize.INTEGER(11),
        references: {
          model: "items",
          key: "id"
        }
      },
      user_id: {
        type: Sequelize.INTEGER(11),
        references: {
          model: "users",
          key: "id"
        }
      },
      customer: Sequelize.STRING(200),
      qty: Sequelize.INTEGER,
      price: Sequelize.DOUBLE(),
      discount: Sequelize.FLOAT(),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("transaction_logs");
  }
};
