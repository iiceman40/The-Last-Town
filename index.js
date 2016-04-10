'use strict';

var server = require('./server/webserver').start();
var io = require('socket.io').listen(server);

// DATABASE
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/the_last_town');
var models = {
	User: require('./server/models/database/User'),
	Game: require('./server/models/database/Game')
};

// Connection to DB
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

	var chatService = require('./server/services/ChatService').getInstance(io, models.User);
	var userManagement = require('./server/managers/UserManagement').getInstance(io, models.User);
	var gameManagement = require('./server/managers/GameManagement').getInstance(io, models);

	// handle incoming events
	io.on('connection', function (socket) {
		console.log('connection established');
		userManagement.handleIncomingEvents(socket);
		chatService.handleIncomingEvents(socket);
		gameManagement.handleIncomingEvents(socket)
	});

});

io.on('connection', function (socket) {
	console.log('connection established outside of database connection');
});

io.on('reconnect', function (socket) {
	console.log('connection re-established outside of database connection');
});