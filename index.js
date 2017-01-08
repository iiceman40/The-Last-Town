'use strict';

var server = require('./server/webserver').start();
var io = require('socket.io').listen(server);

// DATABASE
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/the_last_town');
var models = {
	User: require('./server/models/database/User'),
	Game: require('./server/models/database/Game'),
	Player: require('./server/models/database/Player')
};

// Connection to DB
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

	var chatService = require('./server/services/ChatService').getInstance(io, models.User),
		sharedDataService = require('./server/services/SharedDataService').getInstance(io),
		userManagement = require('./server/managers/UserManagement').getInstance(io, models.User),
		gameManagement = require('./server/managers/GameManagement').getInstance(io, models),
		movementManagement = require('./server/managers/MovementManagement').getInstance(io, models);

	// handle incoming events
	io.on('connection', function (socket) {
		console.log('DEBUG - socket connection established');
		userManagement.handleIncomingEvents(socket);
		chatService.handleIncomingEvents(socket);
		gameManagement.handleIncomingEvents(socket)
		movementManagement.handleIncomingEvents(socket)
		sharedDataService.handleIncomingEvents(socket)
	});

});

io.on('connection', function (socket) {
	console.log('DEBUG - socket connection established outside of database connection');
});

io.on('reconnect', function (socket) {
	console.log('DEBUG - socket connection re-established outside of database connection');
});