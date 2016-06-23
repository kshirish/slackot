const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
	created: { 
		type: Date, 
		default: Date.now 
	},
	username: String,
	password: String,
	isOnline: {
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model('User', userSchema);