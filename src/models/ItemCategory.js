const Sequelize = require('sequelize');
const Model = Sequelize.Model;


class ItemCategory extends Model { }

ItemCategory.init(
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
      name: Sequelize.STRING(200),
      status: Sequelize.SMALLINT,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
  },
  {
	sequelize,
    modelName: "item_categories"
  }
);

module.exports = ItemCategory;
