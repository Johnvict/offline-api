const express = require('express');
const Router = express.Router();
const itemCategoryCtrl = require('./../controllers/itemCategory');

Router.get('/all', (req, res) => itemCategoryCtrl.allItemCategory(req, res));
Router.get('/one/:id', (req, res) => itemCategoryCtrl.oneItemCategory(req, res));
Router.get('/check-exist/:name', (req, res) => itemCategoryCtrl.checkItemCategory(req, res));
Router.post('/create', (req, res) => itemCategoryCtrl.createItemCategory(req, res)); 

Router.put('/update', (req, res) => itemCategoryCtrl.updateItemCategory(req, res));
Router.delete('/delete/:id', (req, res) => itemCategoryCtrl.deleteItemCategory(req, res));

module.exports = Router;
