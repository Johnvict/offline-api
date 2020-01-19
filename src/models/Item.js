const Sequelize = require('sequelize');
const Model = Sequelize.Model;


class Item extends Model { }

Item.init(
  {
      id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
      },
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
      name: Sequelize.STRING(200),
      status: Sequelize.SMALLINT,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
  },
  {
	sequelize,
    modelName: "items"
  }
);

module.exports = Item;
