"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("client_item_classes", {
      id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
      },
      item_class_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "item_classes",
          key: "id"
        }
      },
      client_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "clients",
          key: "id"
        }
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("client_item_classes");
  }
};
