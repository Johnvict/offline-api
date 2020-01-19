const ItemClass = require('./../models/ItemClass');
const Item = require('./../models/Item');
const ItemCategory = require('./../models/ItemCategory');
const ClientItemClass = require('./../models/ClientItemClass');
const Validator = require('./../middleware/validator');
const Op = require('sequelize').Op;

const itemClassDescendants = [{model: ItemCategory, as: 'itemCategories', include: [ { model: Item, as: 'items' } ]}];
const allItemClass = (req, res) => {
	ItemClass.findAll({include: itemClassDescendants}).then(itemClasses => {
		res.status(200).json({ status: 1, data: itemClasses });
	});
}

const oneItemClass = (req, res) => {	
	const {id }= req.params;
	ItemClass.findByPk(id, {include: itemClassDescendants}).then(itemClass => {
		res.status(200).json({
			status: 1,
			data: itemClass
		});
	});
}

const getOneItemClass = async (pk) => {
	return await ItemClass.findByPk(pk, {include: itemClassDescendants}).then( data => data);
}

const checkItemClass  = (req, res) => {
	const { name } = req.params;
	ItemClass.findOne({where: {name}}).then( data => {
		res.status(200).json({
			status: 1,
			found: data ? true : false
		});
	});
}

const createItemClass = (req, res) => {
	if (!req.body) res.status(421).json({message: "item class data required"});
	const newItemClassData = req.body;
	const isDataValid = Validator.validator(Validator.newItemClassStruct, newItemClassData);
	if (isDataValid !== true) res.status(422).json(isDataValid);

	const dataToStore = {name, status }  = newItemClassData;
	ItemClass.findOrCreate({
		where: {name},
		defaults: { ...dataToStore } 
	}).then( async (queryRes) => {
		if (queryRes[1]) {
			res.status(201).json({
				status: 1,
				data: await getOneItemClass(queryRes[0].id).then(Data => Data)
			});
		} else {
			res.status(421).json({
				status: 0,
				message: "data already exists"
			});
		}
	}).catch(e => console.log(e))
};

const createClientItemClass = (req, res) => {
	if (!req.body) res.status(421).json({message: "client item class data required"});
	const newClientItemClassData = req.body;
	const isDataValid = Validator.validator(Validator.cleintItemClassStruct, newClientItemClassData);
	if (isDataValid !== true) res.status(422).json(isDataValid);

	const dataToStore = {client_id, item_class_id }  = newClientItemClassData;
	ClientItemClass.findOrCreate({
		where: {[Op.and]: [{client_id}, { item_class_id }]},
		defaults: { ...dataToStore } 
	}).then( async (queryRes) => {
		if (queryRes[1]) {
			res.status(201).json({
				status: 1,
				data: queryRes[0]
			});
		} else {
			res.status(421).json({
				status: 0,
				message: "data already exists"
			});
		}
	}).catch(e => console.log(e))
};

const updateItemClass = (req, res) => {
	if (!req.body) res.status(421).json({message: "item class data required"});

	const latestItemClassData = req.body;
	const isDataValid = Validator.validator(Validator.updateItemClassStruct, latestItemClassData);
	if (isDataValid !== true) res.status(422).json(isDataValid);
	const dataToStore = { name, status }  = latestItemClassData;
	ItemClass.update({ ...dataToStore }, {returning: true, where: { id: latestItemClassData.id }})
	.then( async (updatedItemClass) => {
		res.status(201).json({
			status: 1,
			data: await getOneItemClass(latestItemClassData.id).then(Data => Data)
		});
	}).catch(e => console.log(e))
};


const deleteItemClass = (req, res) => {	
	const {id }= req.params;
	ItemClass.destroy({where: {id}}).then(noOfItemDeleted => {
		res.status(200).json({
			status: noOfItemDeleted < 1 ? -1 : 1,
			message: noOfItemDeleted < 1 ? 'data not found' : 'data deleted successfully'
		});
	});
}

const deleteClientItemClass = (req, res) => {	
	const {id } = req.params;
	ClientItemClass.destroy({where: {id}}).then(noOfItemDeleted => {
		res.status(200).json({
			status: noOfItemDeleted < 1 ? -1 : 1,
			message: noOfItemDeleted < 1 ? 'data not found' : 'data deleted successfully'
		});
	});
}

module.exports = { allItemClass, oneItemClass, getOneItemClass, createItemClass, updateItemClass, deleteItemClass, checkItemClass, createClientItemClass, deleteClientItemClass }