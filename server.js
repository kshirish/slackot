const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const router = express.Router();

const morgan = require('morgan');
const jwt    = require('jsonwebtoken');
const bodyParser = require('body-parser');
const io = require('socket.io').listen(server);
const {secret} = require('./config');
const connect = require('./database/connect');
const socketIO = require('./socket/socketIO');

const port = process.env.PORT || 9999;

// body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// static assets
app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/bower_components/angular/`));
app.use(express.static(`${__dirname}/bower_components/angular-route/`));
app.use(express.static(`${__dirname}/bower_components/jquery/dist`));
app.use(express.static(`${__dirname}/bower_components/bootstrap/dist`));

// use morgan to log requests to the console
app.use(morgan('dev'));

// socket
socketIO(io);

// route's namespace
app.use('/api/v1', router);

require('./routes/unguarded')(router, jwt, secret);
require('./routes/middlewares')(router, jwt, secret);
require('./routes/guarded')(router);

// catch-all
app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

// listening to port
server.listen(port, () => console.log(`Slackot is running on ${port}`));

// connect to mongo server
connect();