const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class TransactionLog extends Model {}

TransactionLog.init(
  {
    id: {
      type: Sequelize.INTEGER(11),
      autoIncrement: true
    },
    token: {
      type: Sequelize.STRING(50),
      primaryKey: true
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
  },
  {
    sequelize,
    modelName: "transaction_logs"
  }
);

module.exports = TransactionLog;
