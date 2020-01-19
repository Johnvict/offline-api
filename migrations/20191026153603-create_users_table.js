"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("users", {
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
    });
  },

  down: (queryInterface, Sequelize) => {
	  return queryInterface.dropTable("users");
  }
};
