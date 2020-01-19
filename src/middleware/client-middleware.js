let Client = require('../models/Client');
let JwtStrategy = require('passport-jwt').Strategy, 
	ExtractJwt = require('passport-jwt').ExtractJwt;
let config = require('../config/config');

let options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: config.jwtSecret
};

module.exports = new JwtStrategy(options, (jwt_payload, done) => {
	Client.findOne({where: { id: jwt_payload.id }}).then( authClient => {
		return authClient ? done(null, authClient) : done(null, false);
	});
});
