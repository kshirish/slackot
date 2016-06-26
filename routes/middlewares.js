module.exports = (router, jwt, secret) => {

	// Allow CORS
	router.use((req, res, next) => {

  		const token = req.headers['x-access-token'];

		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-type, Accept, X-Access-Token, X-Key');

		if (token) {

			// verifies secret and checks exp
			jwt.verify(token, secret, function(err, decoded) {      

				if (err) {

					return res.json({ success: false, message: 'Failed to authenticate token.' });    

				} else {

					req.decoded = decoded;    
					next();
				}
			});

		} else {

			return res.status(403).send({success: false, message: 'No token provided.'})
		}

	});
};
