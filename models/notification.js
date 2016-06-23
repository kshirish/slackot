const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const notificationSchema = new mongoose.Schema({
	created: { 
		type: Date, 
		default: Date.now 
	},
	content: String,
	username: String	
});

module.exports = mongoose.model('Notification', notificationSchema);