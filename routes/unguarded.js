const Notification = require('../models/notification');
const User = require('../models/user');
const Room = require('../models/room');
const {sampleNotifications} = require('../sample') ;

module.exports = (router, jwt, secret) => {

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

		// find the user
		User.findOne({username: req.body.username})
			.then(user => {
				
				console.log(user);

				if (!user) {

					res.json({success: false, message: 'Authentication failed. User not found.'});

				} else if (user) {

					// check if password matches
					if (user.password != req.body.password) {

						res.json({success: false, message: 'Authentication failed. Wrong password.'});

					} else {

						// create a token
						const token = jwt.sign(user, secret, {
							expiresIn: '24h'
						});

						// set user information in session
						req.session.username = user.username;
						req.session.userId = user._id;

						// return the information including token as JSON
						res.json({success: true, token: token});
					}   
				}
			})
			.catch(() => res.json({success: false, message: 'Error in logging.'}))
	});

	// signup
	router.post('/signup', (req, res) => {
		
		const {username, password} = req.body;
		const user = new User({username, password});

		user.save()
			.then(() => res.json({success: true, message: 'You have signed up successfully. Now, login and continue.'}))
			.catch(() => res.json({success: false, message: 'Error in signup.'}));
	});
};