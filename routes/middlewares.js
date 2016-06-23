module.exports = router => {

	// Allow CORS
	router.use((req, res, next) => {

		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-type, Accept, X-Access-Token, X-Key');
		
		if (req.method === 'OPTIONS' || req.url.indexOf('login') === -1 || !req.session.username) {
			res.status(200).end();
		} else {
			next();
		}
	});
};
