const Sequelize = require('sequelize');
const Model = Sequelize.Model;


class ItemClass extends Model { }

ItemClass.init(
  {
      id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
      },

      name: Sequelize.STRING(200),
      status: Sequelize.SMALLINT,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
  },
  {
	sequelize,
    modelName: "item_classes"
  }
);

module.exports = ItemClass;
