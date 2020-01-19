'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("item_classes", {
		id: {
			type: Sequelize.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
		},
	
		name: Sequelize.STRING(200),
		status: Sequelize.SMALLINT,
		createdAt: Sequelize.DATE,
		updatedAt: Sequelize.DATE
	});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("item_classes");
  }
};
