"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("clients", {
      id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
      },
      location_id: {
        type: Sequelize.INTEGER(11),
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
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("clients");
  }
};
