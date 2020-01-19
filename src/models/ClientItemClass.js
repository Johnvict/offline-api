const Sequelize = require('sequelize');
const Model = Sequelize.Model;


class ClientItemClass extends Model { }

ClientItemClass.init(
  {
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
  },
  {
	sequelize,
    modelName: "client_item_classes"
  }
);

module.exports = ClientItemClass;
