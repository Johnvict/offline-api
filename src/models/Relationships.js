const Client = require('./Client');
const Location= require('./Location');
const User = require('./User');
const Item = require('./Item');
const ItemClass = require('./ItemClass');
const ItemCategory= require('./ItemCategory');
const Stock = require('./Stock');
const TransactionLog = require('./TransactionLog');

exports = Location.hasMany(Client, {
	foreignKey: 'location_id',
	as: 'clients'
});
exports = Location.hasMany(User, {
	foreignKey: 'location_id',
	as: 'users'
});

exports = Client.belongsTo(Location, {
	foreignKey: 'location_id',
	as: 'location'
});
exports = Client.hasMany(User, {
	foreignKey: 'client_id',
	as: 'users'
});
exports = Client.hasMany(Stock, {
	foreignKey: 'client_id',
	as: 'stocks'
});
exports = Client.belongsToMany(ItemClass, {
	through: 'client_item_classes',
	as: 'itemClasses',
	foreignKey: 'client_id',
	otherKey: 'item_class_id',
});

exports = User.belongsTo(Location, {
	foreignKey: 'location_id',
	as: 'location'
});
exports = User.belongsTo(Client, {
	foreignKey: 'client_id',
	as: 'client'
});
exports = User.hasMany(TransactionLog, {
	foreignKey: 'user_id',
	as: 'transactionLogs'
});

exports = Item.belongsTo(ItemCategory, {
	foreignKey: 'item_category_id',
	as: 'itemCategory'
});
exports = Item.belongsTo(ItemClass, {
	foreignKey: 'item_class_id',
	as: 'itemClass'
});
exports = Item.hasMany(TransactionLog, {
	foreignKey: 'item_id',
	as: 'transactionLogs'
});
exports = Item.hasMany(Stock, {
	foreignKey: 'item_id',
	as: 'stocks'
});

exports = ItemCategory.belongsTo(ItemClass, {
	foreignKey: 'item_class_id',
	as: 'itemClass'
});
exports = ItemCategory.hasMany(Item, {
	foreignKey: 'item_category_id',
	as: 'items'
});
exports = ItemCategory.hasMany(TransactionLog, {
	foreignKey: 'item_category_id',
	as: 'transactionLogs'
});

exports = ItemClass.belongsToMany(Client, {
	through: 'client_item_classes',
	as: 'clients',
	foreignKey: 'item_class_id',
	otherKey: 'client_id'
});
exports = ItemClass.hasMany(ItemCategory, {
	foreignKey: 'item_class_id',
	as: 'itemCategories'
});
exports = ItemClass.hasMany(Item, {
	foreignKey: 'item_class_id',
	as: 'items'
});
exports = ItemClass.hasMany(TransactionLog, {
	foreignKey: 'item_class_id',
	as: 'transactionLogs'
});

exports = Stock.belongsTo(Item, {
	foreignKey: 'item_id',
	as: 'item'
});
exports = Stock.belongsTo(Client, {
	foreignKey: 'client_id',
	as: 'client'
});

exports = TransactionLog.belongsTo(Item, {
	foreignKey: 'item_id',
	as: 'item'
});
exports = TransactionLog.belongsTo(User, {
	foreignKey: 'user_id',
	as: 'user'
});
exports = TransactionLog.belongsTo(ItemCategory, {
	foreignKey: 'item_category_id',
	as: 'itemCategory'
});
exports = TransactionLog.belongsTo(ItemClass, {
	foreignKey: 'item_class_id',
	as: 'itemClass'
});
