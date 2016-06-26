const Notification = require('../models/notification');
const User = require('../models/user');
const Room = require('../models/room');
const {sampleNotifications} = require('../sample') ;

module.exports = (router, jwt, secret) => {

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