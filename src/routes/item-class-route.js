const express = require('express');
const Router = express.Router();
const itemClassCtrl = require('./../controllers/itemClassController');

Router.get('/all', (req, res) => itemClassCtrl.allItemClass(req, res));
Router.get('/one/:id', (req, res) => itemClassCtrl.oneItemClass(req, res));
Router.get('/check-exist/:name', (req, res) => itemClassCtrl.checkItemClass(req, res));
Router.post('/create', (req, res) => itemClassCtrl.createItemClass(req, res)); 
Router.post('/create-client-item-class', (req, res) => itemClassCtrl.createClientItemClass(req, res)); 

Router.put('/update', (req, res) => itemClassCtrl.updateItemClass(req, res));
Router.delete('/delete/:id', (req, res) => itemClassCtrl.deleteItemClass(req, res));
Router.delete('/delete-client-item-class/:id', (req, res) => itemClassCtrl.deleteClientItemClass(req, res));

module.exports = Router;
