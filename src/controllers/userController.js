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

const UserAssociations = [
  { model: Location, as: "location" },
  { model: TransactionLog, as: "transactionLogs" },
  {
    model: Client,
    as: "client",
    include: [
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
					{ model: Stock, as: "stocks" }
				]
              }
            ]
          }
        ]
      }
    ]
  }
];

const allUsers = (req, res) => {	
	User.findAll({include: UserAssociations}).then(users => {
		res.status(200).json({ status: 1, data: users });
	});
}

const oneUser = (req, res) => {	
	const {id }= req.params;
	User.findByPk(id, {include: UserAssociations}).then(user => {
		res.status(200).json({
			status: 1,
			data: user
		});
	});
}

const getOneUser = async (pk) => {
	return await User.findByPk(pk, {include: UserAssociations}).then( data => data);
}

const getAuthUser = async (pk, client_id) => {
	const AuthUserAssociations = await [
    { model: Location, as: "location" },
    { model: TransactionLog, as: "transactionLogs" },
    {
      model: Client,
      as: "client",
      include: [
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
                  as: "items",
                  include: [{ model: Stock, as: "stocks", where: {client_id} }]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
	return await User.findByPk(pk, {include: AuthUserAssociations}).then( data => data);
}

const checkPhone  = (req, res) => {
	const { phone } = req.params;
	User.findOne({where: {phone}}).then( data => {
		res.status(200).json({
			status: 1,
			found: data ? true : false
		});
	});
}

const checkEmail  = (req, res) => {
	const { email } = req.params;
	console.log(email);
	User.findOne({where: {email}}).then( data => {
		res.status(200).json({
			status: 1,
			found: data ? true : false
		});
	});
}

const createUser = (req, res) => {
	if (!req.body) res.status(421).json({message: "user data required"});
	const newUserData = req.body;
	const isDataValid = Validator.validator(Validator.newUserStruct, newUserData);
	if (isDataValid !== true) {
		res.status(422).json(isDataValid);
	} else {
		newUserData.password = Auth.hashPassword(newUserData.password);
		const newLocation = { cordinateLong, cordinateLat } = newUserData;
	
		Location.findOrCreate({
			where: { cordinateLong, cordinateLat },
			defaults: newLocation
		}).then( queryRes1 => {
			const location_id = queryRes1[0].id;
			const dataToStore = {client_id, username, address, phone, email, password }  = newUserData;
			User.findOrCreate({
				where: {[Op.or]: [{phone}, {email}, {username}]},
				defaults: { ...dataToStore, location_id } 
			}).then( async (queryRes) => {
				if (queryRes[1]) {
					res.status(201).json({
						status: 1,
						data: await getOneUser(queryRes[0].id).then(Data => Data)
					});
				} else {
					res.status(421).json({
						status: 0,
						message: "data already exists"
					});
				}
			});
		}).catch(e => console.log(e))
	}
};

const updateUser = (req, res) => {
	if (!req.body) res.status(421).json({message: "client data required"});

	const latestUserData = req.body;
	const isDataValid = Validator.validator(Validator.updateUserStruct, latestUserData);

	if (isDataValid !== true) {
		res.status(422).json(isDataValid);
	} else {
		const newLocation = { cordinateLong, cordinateLat } = latestUserData;
	
		Location.findOrCreate({
			where: { cordinateLong, cordinateLat },
			defaults: newLocation
		}).then( queryRes1 => {
			const location_id = queryRes1[0].id;
			const dataToStore = { address, phone, email }  = latestUserData;
			User.update({ ...dataToStore, location_id }, {returning: true, where: { id: latestUserData.id }})
			.then( async (updatedClient) => {
				res.status(201).json({
					status: 1,
					data: await getAuthUser(latestUserData.id, latestUserData.client_id).then(Data => Data)
				});
			});
		}).catch(e => console.log(e))
	}
};


const deleteUser = (req, res) => {	
	const {id }= req.params;
	User.destroy ({where: {id}}).then(user => {
		res.status(200).json({
			status: user < 1 ? -1 : 1,
			message: user < 1 ? 'data not found' : 'data deleted successfully'
		});
	});
}

const changePassword = async (req, res) => {
	if (!req.body) res.status(421).json({message: "password data required"});
	const userPasswordData = req.body;
	const isDataValid = Validator.validator(Validator.passwordData, userPasswordData);
	
	console.table(isDataValid);
	if (isDataValid !== true) {
		res.status(422).json(isDataValid);
	} else {
		await getOneUser(userPasswordData.id).then(Data => {
			userPasswordData['existing_password'] = Data.password;
		});
		const isPasswordValid = Validator.validatePassword(userPasswordData);
		if (!isPasswordValid) {
			res.status(401).json({ status: -1, message: 'old password is invalid' });
		} else {
			userPasswordData.new_password = Auth.hashPassword(userPasswordData.new_password);
			console.log(userPasswordData);
			User.update({ password: userPasswordData.new_password }, {returning: true, where: { id: userPasswordData.id }})
			.then( async (updatedClient) => {
				const user = await getOneUser(userPasswordData.id);
				res.status(201).json({
					status: 1,
					data: await getAuthUser(userPasswordData.id, user.client_id).then(Data => Data)
				});
			});
		}
	}
}

const login = (req, res) => {
	const data = { username, password } = req.body;
	const isRequestValid = Validator.validator(Validator.userLoginData, data);
	if (isRequestValid !== true)  {
		res.status(400).json(isRequestValid);
	} else {
		User.findOne({where: {[Op.or]: [{email: username}, { username }]}}).then( async (user) => {
			if (!user) {
				res.status(400).json({status: -1, message: 'account not found'});
			} else {
				if (!Auth.comparePassword(password, user.password)) {
					res.status(400).json({status: '-1', message: 'invalid credentials'});
				} else {
					res.json({
						status: 1,
						token:  Auth.generateToken(user.id, user.email),
						data: await getAuthUser(user.id, user.client_id).then(Data => Data)
					});
				}
			}
		});
	}
}




module.exports = { allUsers, oneUser, getOneUser, createUser, updateUser, deleteUser, checkPhone, checkEmail, changePassword, login  }