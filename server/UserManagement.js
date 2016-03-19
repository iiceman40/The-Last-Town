'use strict';

var instance = null;

var UserManagement = function (io, UserModel) {
	var _this = this;

	_this.comService = require('../server/ClientNotificationService.js').getInstance(io);
	_this.UserModel = UserModel;
	_this.clients = io.sockets.sockets;

	// handle incoming events
	io.on('connection', function (socket) {
		console.log('connection established');

		socket.on('signUp', function(data){
			_this.signUserUp(socket, data);
		});

		socket.on('signIn', function(data){
			_this.signUserIn(socket, data);
		});

		socket.on('signOut', function(data){
			_this.signUserOut(socket, data);
		});

		socket.on('updateData', function(data){
			_this.updateData(socket, data);
		});

		socket.on('disconnect', function(){
			_this.signUserOut(socket);
		});
	});

	return _this;
};

/**
 * collects and returns data about all connected users
 * @returns {Array}
 */
UserManagement.prototype.getConnectedUsersData = function(){
	var _this = this;
	var connectedUsersData = [];
	for(var clientSocketId in _this.clients){
		if(_this.clients.hasOwnProperty(clientSocketId)){
			var client = _this.clients[clientSocketId];
			if(client.hasOwnProperty('user')) {
				var userData = {};
				userData.name = client.user.name;
				userData.email = client.user.email;
				userData._id = String(client.user._id);
				connectedUsersData.push(userData);
			}
		}
	}
	return connectedUsersData;
};

/**
 * finds and returns a socket for a given user 
 * @param user
 * @returns {*}
 */
UserManagement.prototype.getSocketForUser = function(user){
	var _this = this;
	for(var clientSocketId in _this.clients) {
		if (_this.clients.hasOwnProperty(clientSocketId)) {
			var client = _this.clients[clientSocketId];
			if(client.hasOwnProperty('user') && String(client.user._id) == String(user._id)) {
				return client;
			}
		}
	}
	return null;
};

/**
 *
 * @param {{}} socket
 * @param {{}} data
 */
UserManagement.prototype.signUserIn = function (socket, data) {
	console.log('sign in attempt', data);
	var _this = this;
	// check if a user with that name is registered
	var query  = _this.UserModel.where({name: data.name});
	query.findOne(function (err, user) {
		if (err) return console.error(err);
		if (user) {
			// check if the password is correct
			if (user.password === data.password) {
				// sign user out if already logged in
				var oldSocket = _this.getSocketForUser(user);
				console.log('USER ALREADY CONNECTED', oldSocket);
				if(oldSocket instanceof Object){
					_this.signUserOut(oldSocket, {});
				}
				// sign user in by adding a reference to his account
				socket.user = user;
				// send updated data to logged in user
				var connectedUsersData = _this.getConnectedUsersData();
				_this.comService.emit('signedIn', {
					success: true,
					message: 'signed in successfully',
					messageType: 'success',
					user: user,
					connectedUsers: connectedUsersData
				}, socket.id);
				// send updated user list to all users
				_this.comService.emit('updateConnectedUsers', {connectedUsers: connectedUsersData});
			} else {
				_this.comService.emit('info', {message: 'password incorrect', messageType: 'warning'}, socket.id);
			}
		} else {
			_this.comService.emit('info', {message: 'user not found', messageType: 'warning'}, socket.id);
		}
	});
};

/**
 *
 * @param socket
 * @param data
 */
UserManagement.prototype.signUserOut = function (socket, data) {
	var _this = this;
	if(socket.hasOwnProperty('user')) {
		delete socket.user; // delete reference to user account
		var connectedUsersData = _this.getConnectedUsersData();
		_this.comService.emit('signedOut', {message: 'signed out', messageType: 'info'}, socket.id);
		_this.comService.emit('updateConnectedUsers', {connectedUsers: connectedUsersData});
	}
};

/**
 *
 * @param socket
 * @param data
 */
UserManagement.prototype.signUserUp = function (socket, data) {
	var _this = this;
	if (data && data.name && data.password) {
		var user = new _this.UserModel({
			name: data.name,
			email: data.email,
			password: data.password // TODO encrypt password
		});

		user.save(function (err, user) {
			if (err) {
				if (err.code == 11000) {
					_this.comService.emit('info', {message: 'username already exists!', messageType: 'warning'}, socket.id);
				}
				return console.error(err);
			}
			_this.comService.emit('info', {message: 'user successfully saved', messageType: 'success'}, socket.id);
			_this.signUserIn(socket, data);
		});
	} else {
		_this.comService.emit('info', {message: 'incomplete user data', messageType: 'warning'}, socket.id);
	}
};

/**
 * 
 * @param socket
 * @param data
 */
UserManagement.prototype.updateData = function (socket, data) {
	var _this = this;
	if(socket.hasOwnProperty('user') && socket.user instanceof _this.UserModel) {
		socket.user.name = data.name;
		socket.user.email = data.email;
		socket.user.password = data.password;
		socket.user.save(function(err){
			if(err) return console.error(err);
			_this.comService.emit('info', {message: 'user data updated', messageType: 'success'}, socket.id);
			var connectedUsersData = _this.getConnectedUsersData();
			_this.comService.emit('updateConnectedUsers', {connectedUsers: connectedUsersData});
		});
	} else {
		console.log('user data update failed - no such user signed in');
	}
};

var getInstance = function(io, UserModel){
	if(!instance){
		instance = new UserManagement(io, UserModel);
	}
	return instance;
};

exports.getInstance = getInstance;