'use strict';

var server = require('./server/webserver').start();
var io = require('socket.io').listen(server);

// DATABASE
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/the_last_town');
var models = {
	User: require('./server/models/User')
};

// Connection to DB
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

	var chatService = require('./server/services/ChatService').getInstance(io, models.User);
	var userManagement = require('./server/managers/UserManagement').getInstance(io, models.User);
	var mapManagement = require('./server/managers/MapManagement').getInstance(io, models.User);

	// handle incoming events
	io.on('connection', function (socket) {
		console.log('connection established');
		userManagement.handleIncomingEvents(socket);
		chatService.handleIncomingEvents(socket);
		mapManagement.handleIncomingEvents(socket)
	});

});