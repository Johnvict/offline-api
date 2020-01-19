const express = require('express');
const Router = express.Router();
const UserRoutes = require("./user-route");
const ClientRoutes = require("./client-route");
const ItemClassRoutes = require("./item-class-route");
const ItemCategoryRoutes = require("./item-category-route");
const TransactionLogRoutes = require("./transaction-log-route");

Router.get('/', (req, res) => {
	res.json({message: 'Hello! API server is working fine'});
});
Router.use('/user', UserRoutes);
Router.use('/client', ClientRoutes);
Router.use('/item-class', ItemClassRoutes);
Router.use('/item-category', ItemCategoryRoutes);
Router.use('/transaction-log', TransactionLogRoutes);


module.exports = Router;