'use strict';

var server = require('./server/webserver').start();
var io = require('socket.io').listen(server);

var ClientNotificationService = require('./server/ClientNotificationService.js');
var clientNotificationService = ClientNotificationService.getInstance(io);

var UserManagement = require('./server/UserManagement.js');
var userManagement = new UserManagement(clientNotificationService);

console.log('node js server running');

// TODO map management
var maps = [];

io.on('connection', function (socket) {
	console.log('connection established');

	socket.on('signUp', function(data){
		userManagement.signUserUp(socket, data);
	});

	socket.on('signIn', function(data){
		userManagement.signUserIn(socket, data);
	});

	socket.on('signOut', function(data){
		userManagement.signUserOut(socket, data);
	});

	socket.on('disconnect', function(){
		userManagement.signUserOut(socket);
	});
});