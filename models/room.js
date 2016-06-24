const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const roomSchema = new mongoose.Schema({
	created: { 
		type: Date, 
		default: Date.now 
	},
	name: String,
	users: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	notifications: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Notification'
	}]
});

module.exports = mongoose.model('Room', roomSchema);