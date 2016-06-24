module.exports = router => {

	// Allow CORS
	router.use((req, res, next) => {

		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-type, Accept, X-Access-Token, X-Key');
		
		console.log(`Requested url : ${req.url}`);
		console.log(`Request came from : ${req.session.username}`);

		if(req.session.username) {
			next();
		} else {
			if(req.url === '/signup' || req.url === '/login') {
				next();
			} else {
				res.status(200).end();	
			}
		}
	});
};
