const newClientStruct = ["cordinateLong", "cordinateLat", "business_name", "short_name", "address", "phone", "email", "password"];
const updateClientStruct = [ "id", "cordinateLong", "cordinateLat", "business_name", "short_name", "address", "phone", "email"];
const newUserStruct = ["cordinateLong", "cordinateLat", "client_id",  "username", "address", "phone", "email", "password"];
const updateUserStruct = ["id", "cordinateLong", "cordinateLat", "client_id",  "address", "phone", "email"];
const passwordData = ["id", "old_password", "new_password"];
const protected = ['password', 'token'];
const clientLoginData = ['password', 'email'];
const userLoginData = ['password', 'username'];
const newItemClassStruct = ['name', 'status'];
const newItemCategoryStruct = ['item_class_id', 'name', 'status'];
const updateItemCategoryStruct = ['id', 'item_class_id', 'name', 'status'];
const transactionLogStruct = ['token', 'item_class_id', 'item_category_id', 'item_id', 'user_id', 'customer', 'qty', 'price', 'discount'];
const updateItemClassStruct = ['id', 'name', 'status'];
const cleintItemClassStruct = ['client_id', 'item_class_id'];
const Auth = require('./authorization');

const validator = ([...keys], data) => {
	let error = [];
	keys.forEach(key => {
		if (!data[key]) error.push(key);
	});
	return error.length < 1 ? true : {status: -1, error: "some fields are missing", fields: error};
}
const logValidator = ([...keys], dataBlock) => {
	let error = [];
	dataBlock.forEach(data => {
		keys.forEach(key => {
			if (!data[key] === null) error.push(key);
		});
	});
	return error.length < 1 ? true : {status: -1, error: "some fields are missing", fields: error};
}

const validatePassword = (data) => {
	const isPasswordValid  = Auth.comparePassword(data.old_password, data.existing_password);
	return isPasswordValid;
}

module.exports = { validator, logValidator, newClientStruct, updateClientStruct, newUserStruct, updateUserStruct, protected, passwordData, validatePassword, clientLoginData, userLoginData, newItemClassStruct, updateItemClassStruct, cleintItemClassStruct, newItemCategoryStruct, updateItemCategoryStruct, transactionLogStruct };