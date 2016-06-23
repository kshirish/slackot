const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const router = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');
const io = require('socket.io').listen(server);
const connect = require('./database/connect');
const socketIO = require('./socket/socketIO');

const port = process.env.PORT || 9999;

// body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// session
app.use(session({secret: 'ssssssssshhhhhh'}));

// static assets
app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/bower_components/angular/`));
app.use(express.static(`${__dirname}/bower_components/jquery/dist`));
app.use(express.static(`${__dirname}/bower_components/bootstrap/dist`));

// socket
socketIO(server);

// route's namespace
app.use('/api/v1', router);

require('./routes/middlewares')(router)
require('./routes/route')(router);

// listening to port
server.listen(port, () => console.log(`Slackot is running on ${port}`));

// connect to mongo server
connect();