const express = require('express');
const Router = express.Router();
const clientCtrl = require('./../controllers/clientController');

var clientMiddleware = require('./../middleware/client-middleware');
const app = express(); 

const passport = require('passport');
app.use(passport.initialize());
passport.use(clientMiddleware);
const clientAuth = passport.authenticate('jwt', {session: false});

Router.get('/all', (req, res) => clientCtrl.allClients(req, res));
Router.get('/one/:id', (req, res) => clientCtrl.oneClient(req, res));
Router.get('/check-phone/:phone', (req, res) => clientCtrl.checkPhone(req, res));
Router.get('/check-email/:email', (req, res) => clientCtrl.checkEmail (req, res));
Router.post('/create', (req, res) => clientCtrl.createClient(req, res)); 

Router.put('/update', clientAuth, (req, res) => clientCtrl.updateClient(req, res));
Router.delete('/delete/:id', clientAuth, (req, res) => clientCtrl.deleteClient(req, res));

Router.put('/update-password', clientAuth, (req, res) => clientCtrl.changePassword(req, res));
Router.post('/login', (req, res) => clientCtrl.login(req, res));

module.exports = Router;
