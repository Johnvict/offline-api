const Client = require('./../models/Client');
const User= require('./../models/User');
const Location = require('./../models/Location');
const ItemClass = require('./../models/ItemClass');
const Stock= require('./../models/Stock');
const Item = require('./../models/Item');
const ItemCategory = require('./../models/ItemCategory');
const TransactionLog = require('./../models/TransactionLog');
const Auth = require('./../middleware/authorization');
const Validator = require('./../middleware/validator');
const Op = require('sequelize').Op;
let authClient;
const ClientDescendants = [
  { model: Location, as: "location" },
  { model: User, as: "users", include: [
	  {model: TransactionLog, as: 'transactionLogs' }
  ] },
  {
    model: ItemClass,
    as: "itemClasses",
    include: [
      {
        model: ItemCategory,
        as: "itemCategories",
        include: [
          {
            model: Item,
			as: "items", include: [
				{ model: Stock, as: "stocks"}
			]
          }
        ]
      }
    ]
  }
];

const allClients = (req, res) => {	
	
	Client.findAll({
		include: [...ClientDescendants]
	}).then(clients => {
		res.status(200).json({ status: 1, data: clients });
	});
}

const oneClient = (req, res) => {	
	const {id }= req.params;
	Client.findByPk(id, {include: ClientDescendants}).then(client => {
		res.status(200).json({
			status: 1,
			data: client
		});
	});
}

const getOneClient = async (pk) => {
	return await Client.findByPk(pk, {include: ClientDescendants}).then( data => data);
}
const getAuthClient = async (pk) => {
	const AuthClientDescendants = await [
		{ model: Location, as: "location" },
		{ model: User, as: "users", include: [
			{model: TransactionLog, as: 'transactionLogs' }
		] },
		{
		  model: ItemClass,
		  as: "itemClasses",
		  include: [
			{
			  model: ItemCategory,
			  as: "itemCategories",
			  include: [
				{
				  model: Item,
				  as: "items", include: [
					  { model: Stock, as: "stocks", where: {client_id: pk}}
				  ]
				}
			  ]
			}
		  ]
		}
	  ];
	return await Client.findByPk(pk, {include: AuthClientDescendants}).then( data => data);
}

const checkPhone  = (req, res) => {
	const { phone } = req.params;
	Client.findOne({where: {phone}}).then( data => {
		res.status(200).json({
			status: 1,
			found: data ? true : false
		});
	});
}

const checkEmail  = (req, res) => {
	const { email } = req.params;
	console.log(email);
	Client.findOne({where: {email}}).then( data => {
		res.status(200).json({
			status: 1,
			found: data ? true : false
		});
	});
}

const createClient = (req, res) => {
	if (!req.body) res.status(421).json({message: "client data required"});
	const newClientData = req.body;
	const isDataValid = Validator.validator(Validator.newClientStruct, newClientData);
	if (isDataValid !== true) res.status(422).json(isDataValid);

	newClientData.password = Auth.hashPassword(newClientData.password);
	const newLocation = { cordinateLong, cordinateLat } = newClientData;

	Location.findOrCreate({
		where: {[Op.and]: [{ cordinateLong}, {cordinateLat }]},
		defaults: newLocation
	}).then( queryRes1 => {
		const location_id = queryRes1[0].id;
		const dataToStore = {business_name, short_name, address, phone, email, password }  = newClientData;
		Client.findOrCreate({
			where: {[Op.or]: [{phone}, {email}]},
			defaults: { ...dataToStore, location_id } 
		}).then( async (queryRes) => {
			if (queryRes[1]) {
				res.status(201).json({
					status: 1,
					data: await getOneClient(queryRes[0].id).then(Data => Data)
				});
			} else {
				res.status(421).json({
					status: 0,
					message: "data already exists"
				});
			}
		});
	}).catch(e => console.log(e))
};

const updateClient = (req, res) => {
	if (!req.body) res.status(421).json({message: "client data required"});

	const latestClientData = req.body;
	const isDataValid = Validator.validator(Validator.updateClientStruct, latestClientData);

	if (isDataValid !== true) {
		res.status(422).json(isDataValid);
	} else {
		const newLocation = { cordinateLong, cordinateLat } = latestClientData;
	
		Location.findOrCreate({
			where: { cordinateLong, cordinateLat },
			defaults: newLocation
		}).then( queryRes1 => {
			const location_id = queryRes1[0].id;
			const dataToStore = { business_name, short_name, address, phone, email }  = latestClientData;
			Client.update({ ...dataToStore, location_id }, {returning: true, where: { id: latestClientData.id }})
			.then( async (updatedClient) => {
				res.status(201).json({
					status: 1,
					data: await getAuthClient(latestClientData.id).then(Data => Data)
				});
			});
		}).catch(e => console.log(e))
	}
};


const deleteClient = (req, res) => {	
	const {id }= req.params;
	Client.destroy ({where: {id}}).then(client => {
		res.status(200).json({
			status: client < 1 ? -1 : 1,
			message: client < 1 ? 'data not found' : 'data deleted successfully'
		});
	});
}

const changePassword = async (req, res) => {
	if (!req.body) res.status(421).json({message: "password data required"});
	const clientPasswordData = req.body;
	const isDataValid = Validator.validator(Validator.passwordData, clientPasswordData);

	if (isDataValid !== true) {
		res.status(422).json(isDataValid);
	} else {
		await getOneClient(clientPasswordData.id).then(Data => {
			clientPasswordData['existing_password'] = Data.password;
		});
		const isPasswordValid = Validator.validatePassword(clientPasswordData);
		if (!isPasswordValid) {
			res.status(401).json({ status: -1, message: 'old password is invalid' });
		} else {
			clientPasswordData.new_password = Auth.hashPassword(clientPasswordData.new_password);
			Client.update({ password: clientPasswordData.new_password }, {returning: true, where: { id: clientPasswordData.id }})
			.then( async (updatedClient) => {
				res.status(201).json({
					status: 1,
					data: await getAuthClient(clientPasswordData.id).then(Data => Data)
				});
			});
		}
	}
}

const login = (req, res) => {
	const data = { email, password } = req.body;
	const isRequestValid = Validator.validator(Validator.clientLoginData, data);
	if (isRequestValid !== true)  {
		res.status(400).json(isRequestValid);
	} else {
		Client.findOne({where: {email}}).then( async (client) => {
			if (!client) {
				res.status(400).json({status: -1, message: 'account not found'});
			} else {
				if (!Auth.comparePassword(password, client.password)) {
					res.status(400).json({status: '-1', message: 'invalid credentials'});
				} else {
					res.json({
						status: 1,
						token:  Auth.generateToken(client.id, client.email),
						data: await getAuthClient(client.id).then(Data => Data)
					});
				}
			}
		});
	}
}

module.exports = { allClients, oneClient, getOneClient, createClient, updateClient, deleteClient, checkPhone, checkEmail, changePassword, login }