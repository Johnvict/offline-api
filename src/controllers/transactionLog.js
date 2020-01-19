const ItemClass = require('./../models/ItemClass');
const ItemCategory = require('./../models/ItemCategory');
const Item = require('./../models/Item');
const User = require('./../models/User');
const TransactionLog = require('./../models/TransactionLog');
const Validator = require('./../middleware/validator');

let tokenArray = [], storedLogs = [], logsTostore = [];

const transactionLogRelations = [
	{model: ItemClass, as: 'itemClass'},
	{model: ItemCategory, as: 'itemCategory'},
	{model: Item, as: 'item'},
	{model: User, as: 'user'},
];
const alltransactionLog = (req, res) => {
	TransactionLog.findAll({include: transactionLogRelations}).then(data => {
		res.status(200).json({ status: 1, data });
	});
}

const oneTransactionLog = (req, res) => {	
	const {token }= req.params;
	TransactionLog.findOne({ where: {token}}, {include: transactionLogRelations}).then(data => {
		res.status(200).json({
			status: 1,
			data
		});
	});
}

const getOneTransactionLog = async (token) => {
	return await TransactionLog.findOne({where: {token}}, {include: transactionLogRelations}).then( data => data);
}
const getManyTransactionLog = async (tokenArr) => {
	let dataArray  = [];
	await TransactionLog.findAll({where: {token: [...tokenArr]}}).then( data => {
		dataArray = data.map(data => data.dataValues.token);
	});
	return await dataArray;
}

const checkTransactionLog  = (req, res) => {
	const { token } = req.params;
	TransactionLog.findOne({where: {token}}).then( data => {
		res.status(200).json({
			status: 1,
			found: data ? true : false
		});
	});
}

extractToken = async (logs) => {
	tokenArray = await [];
	tokenArray = await logs.map(log => log.token);
	return await tokenArray;
}

const createTransactionLog = async (req, res) => {
	if (!req.body) res.status(421).json({message: "transaction log data required"});
	const newTransactionLog = req.body.logs;
	const isDataValid = Validator.logValidator(Validator.transactionLogStruct, newTransactionLog);
	if (isDataValid !== true) {
		res.status(422).json(isDataValid);
	} else {
		const dataToStore = { token, item_class_id, item_category_id, item_id, user_id, customer, qty, price, discount }  = newTransactionLog;
		const tokenArr = await extractToken(dataToStore);
		getManyTransactionLog(tokenArr).then( storedTokens => {
			newTransactionLog.forEach(logData => {
				if (storedTokens.find((token) => token == logData.token)) {
					storedLogs.push(logData.token);
				} else {
					logsTostore.push(logData);
				}
			});
		}).then( () => {
			TransactionLog.bulkCreate(logsTostore, { fields: Validator.transactionLogStruct}).then( async (queryRes) => {
				res.status(201).json({
					status: 1,
					fulfiled: await extractToken(logsTostore),
					stored: storedLogs
				});
			}).catch(e => console.log(e))
		});
	}
};

const deleteTransactionLog = (req, res) => {	
	const {token }= req.params;
	TransactionLog.destroy({where: {token}}).then(noOfItemDeleted => {
		res.status(200).json({
			status: noOfItemDeleted < 1 ? -1 : 1,
			message: noOfItemDeleted < 1 ? 'data not found' : 'data deleted successfully'
		});
	});
}

module.exports = { alltransactionLog, oneTransactionLog, getOneTransactionLog, createTransactionLog,  deleteTransactionLog,checkTransactionLog }