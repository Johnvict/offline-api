const bcrypt = require('bcrypt');

module.exports = {
	jwtSecret: 'offline-online-api-secret-goes-here-make-secret-a-secret',
	salt: bcrypt.genSaltSync(10)
}
