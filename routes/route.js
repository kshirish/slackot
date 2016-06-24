const Notification = require('../models/notification');
const User = require('../models/user');
const Room = require('../models/room');
const {sampleNotifications} = require('../sample') ;

module.exports = router => {

	// generates sample notifications to get started
    router.post('/init', (req, res) => {

		const notifications = sampleNotifications.map(function(notification) {
			return new Notification(notification);
		});	

		Notification.insertMany(notifications)
			.then(() => res.json({success: 'Sample notifications created successfully!'}))
			.catch(() => res.json({error: 'Error in creating sample notifications'}));

    });

	// login
	router.post('/login', (req, res) => {

		const {username, password} = req.body;
		const update = {$set: {isOnline: true}};
		const options = {new: true};

		User.findOneAndUpdate({username, password}, update, options)
			.then((user) => {

				req.session.username = user.username;
				req.session.userId = user._id;
				res.json({success: 'Logged in successfully!'});
			})
			.catch(() => res.json({error: 'Error in logging'}));
	});

	// logout
	router.get('/logout', (req, res) => {

		const {username} = req.session.username;
		const update = {$set: {isOnline: false}};
		const options = {new: true};

		User.findOneAndUpdate({username}, update, options)
			.then(() => {
		
				req.session.destroy(err => {
	
					if(err) {
						res.json({success: 'Logged out successfully!'});
					} else {
						res.redirect('/');
					}
				});		
			})
			.catch(() => res.json({error: 'Error in logging'}));
	});

	// signup
	router.post('/signup', (req, res) => {
		
		const {username, password} = req.body;
		const user = new User({username, password});

		user.save()
			.then(() => {
				res.json({success: 'Signed up successfully!'});
			})
			.catch(() => res.json({error: 'Error in signup'}));
	});

	// joins a room
	router.put('/join/:roomId', (req, res) => {

		const _id = req.params.roomId;

		Room.findById({_id})
			.then(room => {
				return Room.update({_id}, {$push: {users: {$each: req.session.userId}}});
			})
			.then(() => res.json({success: 'Joined successfully'}))
			.catch(() => res.json({error: 'Error in getting notifications for this room'}));
	});
		
	// leaves a room
	router.put('/leave/:roomId', (req, res) => {

		const _id = req.params.roomId;

		Room.findById({_id})
			.then(room => {
				return Room.update({_id}, {$pull: {users: req.session.userId}});
			})
			.then(() => res.json({success: 'Left successfully'}))
			.catch(() => res.json({error: 'Error in getting notifications for this room'}));
	});

	// sends a notification in room
	router.put('/send/:roomId', (req, res) => {

		const _id = req.params.roomId;

		Room.findById({_id})
			.then(room => {

				const notification = new Notification({
					content: req.body.content,
					username: req.session.username
				});

				return notification.save();
			})
			.then((notification) => Room.update({_id}, {$push: {notifications: {$each: notification._id}}}))
			.then(() => res.json({success: 'Notification sent successfully'}))
			.catch(() => res.json({error: 'Error in getting notifications for this room'}));
	});

	// get all notifcations of a room
	router.get('/all/notifications/:roomId', (req, res) => {
		const _id = req.params.roomId;

		Room.findById({_id})
			.then(room => {

				return Notification.find({_id: { $in: room.notifications } });
			})
			.then(notifications => res.json({success: notifications}))
			.catch(() => res.json({error: 'Error in getting notifications for this room'}));
	});

	// get all users of a room
	router.get('/all/users/:roomId', (req, res) => {
		const _id = req.params.roomId;

		Room.findById({_id})
			.then(room => {

				return User.find({_id: { $in: room.users } });
			})
			.then(users => res.json({success: users}))
			.catch(() => res.json({error: 'Error in getting users for this room'}));
	});

	// create a room
	router.post('/create/room', (req, res) => {

		const room = new Room({
			name: req.body.name,
			users: [],
			notifications: []
		});

		room.save()
			.then(() => res.json({success: 'Room created successfully'}))
			.catch(() => res.json({error: 'Error in  creating room'}));
	});

	// get the rooms of a user
	router.get('/all/rooms', (req, res) => {

		const joined = Room.find({users: { $eq: req.session.userId }});
		const other = Room.find({users: { $ne: req.session.userId }});

		Promise.all([joined, other])
			.then(([joined, other]) => {

				res.json({
					joined: joined.map((room) => ({_id: room._id, name: room.name})),
					other: other.map((room) => ({_id: room._id, name: room.name}))
				})
			})
			.catch(() => res.json({error: 'Error in getting rooms for a user'}));
	});
};