const Notification = require('../models/notification');
const User = require('../models/user');
const Room = require('../models/room');
const {sampleNotifications} = require('../sample') ;

module.exports = router => {

	// logout
	router.get('/logout', (req, res) => {

		const {username} = req.decoded._doc.username;
		const update = {$set: {isOnline: false}};
		const options = {new: true};

		User.findOneAndUpdate({username}, update, options)
			.then(() => {
		
				req.session.destroy(err => {
	
					if(err) {
						res.json({success: true, message: 'Logged out successfully!'});
					} else {
						res.redirect('/');
					}
				});		
			})
			.catch(() => res.json({success: false, message: 'Error in logging'}));
	});

	// joins a room
	router.put('/join/:roomId', (req, res) => {

		const _id = req.params.roomId;
		const userId = req.decoded._doc._id;

		Room.findById({_id})
			.then(room => Room.update({_id}, {$push: {users: userId}}))
			.then((room) => res.json({success: true, room}))
			.catch(() => res.json({success: false, message: 'Error in joining this room'}));
	});

	// leaves a room
	router.put('/leave/:roomId', (req, res) => {

		const _id = req.params.roomId;
		const userId = req.decoded._doc._id;

		Room.findById({_id})
			.then(room => Room.update({_id}, {$pull: {users: userId}}))
			.then((room) => res.json({success: true, room}))
			.catch(() => res.json({success: false, message: 'Error in leaving this room'}));
	});

	// sends a notification in room
	router.put('/send/:roomId', (req, res) => {

		const _id = req.params.roomId;

		Room.findById({_id})
			.then(room => {

				const notification = new Notification({
					content: req.body.content,
					username: req.decoded._doc.username
				});

				return notification.save();
			})
			.then((notification) => Room.update({_id}, {$push: {notifications: notification._id}}))
			.then(() => res.json({success: true, message: 'Notification sent successfully'}))
			.catch(() => res.json({success: false, message: 'Error in getting notifications for this room'}));
	});

	// get the room by id
	router.get('/room/:roomId', (req, res) => {
		
		const _id = req.params.roomId;

		Room.findById({_id})
			.then(room => res.json({success: true, roomname: room.name}))
			.catch(() => res.json({success: false, message: 'Error in getting details for this room'}));
	});

	// get all notifcations of a room
	router.get('/all/notifications/:roomId', (req, res) => {
		
		const _id = req.params.roomId;

		Room.findById({_id})
			.then(room => Notification.find({_id: {$in: room.notifications}}))
			.then(notifications => res.json({success: true, notifications}))
			.catch(() => res.json({success: false, message: 'Error in getting notifications for this room'}));
	});

	// get all users of a room
	router.get('/all/users/:roomId', (req, res) => {
		
		const _id = req.params.roomId;

		Room.findById({_id})
			.then(room => User.find({_id: {$in: room.users}}))
			.then(data => {

				users = data.map(user => ({
					_id: user._id, 
					username: user.username, 
					created: user.created, 
					isOnline: user.isOnline
				}));

				res.json({success: true, users});
			})
			.catch(() => res.json({success: false, message: 'Error in getting users for this room'}));
	});

	// create a room
	router.post('/create/room', (req, res) => {

		const room = new Room({
			name: req.body.name,
			users: [],
			notifications: []
		});

		room.save()
			.then((room) => res.json({success: true, room}))
			.catch(() => res.json({success: false, message: 'Error in  creating room'}));
	});

	// get the rooms of a user
	router.get('/all/rooms', (req, res) => {

		const joined = Room.find({users: { $eq: req.decoded._doc._id }});
		const other = Room.find({users: { $ne: req.decoded._doc._id }});

		Promise.all([joined, other])
			.then(([joined, other]) => {

				res.json({
					success: true,
					joined: joined.map((room) => ({_id: room._id, name: room.name})),
					other: other.map((room) => ({_id: room._id, name: room.name}))
				})
			})
			.catch(() => res.json({success: false, message: 'Error in getting rooms for a user'}));
	});
};