const ItemClass = require('./../models/ItemClass');
// const TransactionLog = require('./../models/TransactionLog');
const ItemCategory = require('./../models/ItemCategory');
const Validator = require('./../middleware/validator');

const itemCategoryRelations = [{model: ItemClass, as: 'itemClass'}];
const allItemCategory = async (req, res) => {
	ItemCategory.findAll({include: itemCategoryRelations}).then(itemCategories => {
		res.status(200).json({ status: 1, data: itemCategories });
	});
}

const oneItemCategory = (req, res) => {	
	const {id }= req.params;
	ItemCategory.findByPk(id, {include: itemCategoryRelations}).then(itemCategory => {
		res.status(200).json({
			status: 1,
			data: itemCategory
		});
	});
}

const getOneItemCategory = async (pk) => {
	return await ItemCategory.findByPk(pk, {include: itemCategoryRelations}).then( data => data);
}

const checkItemCategory  = (req, res) => {
	const { name } = req.params;
	ItemCategory.findOne({where: {name}}).then( data => {
		res.status(200).json({
			status: 1,
			found: data ? true : false
		});
	});
}

const createItemCategory = (req, res) => {
	if (!req.body) res.status(421).json({message: "item category data required"});
	
	const newItemCategoryData = req.body;
	const isDataValid = Validator.validator(Validator.newItemCategoryStruct, newItemCategoryData);
	if (isDataValid !== true) {
		res.status(422).json(isDataValid);
	} else {
		const dataToStore = { item_class_id, name, status }  = newItemCategoryData;
		ItemCategory.findOrCreate({
			where: {name},
			defaults: { ...dataToStore } 
		}).then( async (queryRes) => {
			if (queryRes[1]) {
				res.status(201).json({
					status: 1,
					data: await getOneItemCategory(queryRes[0].id).then(Data => Data)
				});
			} else {
				res.status(421).json({
					status: 0,
					message: "data already exists"
				});
			}
		}).catch(e => console.log(e))
	}
};

const updateItemCategory = (req, res) => {
	if (!req.body) res.status(421).json({message: "item category data required"});

	const latestItemCategoryData = req.body;
	const isDataValid = Validator.validator(Validator.updateItemCategoryStruct, latestItemCategoryData);
	if (isDataValid !== true) {
		res.status(422).json(isDataValid);
	} else {
		const dataToStore = { name, status }  = latestItemCategoryData;
		ItemCategory.update({ ...dataToStore }, {returning: true, where: { id: latestItemCategoryData.id }})
		.then( async (updatedItemClass) => {
			res.status(201).json({
				status: 1,
				data: await getOneItemCategory(latestItemCategoryData.id).then(Data => Data)
			});
		}).catch(e => console.log(e))
	}
};


const deleteItemCategory = (req, res) => {	
	const {id }= req.params;
	ItemCategory.destroy({where: {id}}).then(noOfItemDeleted => {
		res.status(200).json({
			status: noOfItemDeleted < 1 ? -1 : 1,
			message: noOfItemDeleted < 1 ? 'data not found' : 'data deleted successfully'
		});
	});
}

module.exports = { allItemCategory, oneItemCategory, getOneItemCategory, createItemCategory, updateItemCategory, deleteItemCategory, checkItemCategory }