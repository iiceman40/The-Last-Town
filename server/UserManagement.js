'use strict';

var UserManagement = function(clientNotificationService){
	var _this = this;

	_this.registeredUsers = {};
	_this.connectedUsers = {};
	_this.cns = clientNotificationService;

	// TODO use singleton
	// TODO code review and comments
	console.log('DEBUG - init new user management');

	return _this;
};

/**
 *
 * @param {{}} socket
 * @param {{}} data
 */
UserManagement.prototype.signUserIn = function(socket, data){
	var _this = this;
	console.log('DEBUG - connected users', this.connectedUsers);
	// check if a user with that name is registered
	var user = _this.registeredUsers[data.email];
	if(user) {
		// check if the password is correct
		if (user.password == data.password) {
			// check if user is already signed in
			var connectedUser = _this.connectedUsers[socket.id];
			if(connectedUser) {
				_this.signUserOut(connectedUser.socketId);
			}
			user.socketId = socket.id;
			_this.connectedUsers[data.email] = user;
			_this.cns.emit('signedIn', {
				success: true,
				message: 'signed in successfully',
				connectedUsers: _this.connectedUsers
			}, socket.id);
			_this.cns.emit('updateConnectedUsers', {connectedUsers: _this.connectedUsers});
		} else {
			_this.cns.emit('info',{message: 'password incorrect'}, socket.id);
			// sign user out if current socket enters wrong password
			if (user.socketId === socket.id) {
				_this.signUserOut(socket, user)
			}
		}
	} else {
		_this.cns.emit('info', {message: 'user not found'}, socket.id);
	}
};

/**
 *
 * @param socket
 * @param data
 */
UserManagement.prototype.signUserOut = function(socket, data){
	var _this = this;
	var user = (!data || !data.email) ? data : this.getConnectedUserBySocketId(socket.id);
	if(!user) return false;
	delete _this.connectedUsers[user.email];
	_this.cns.emit('signedOut', {message: 'signed out'}, socket.id);
	_this.cns.emit('updateConnectedUsers', {connectedUsers: _this.connectedUsers});
};

/**
 *
 * @param socket
 * @param data
 */
UserManagement.prototype.signUserUp = function(socket, data){
	var _this = this;
	if(data && data.email && data.password) {
		var user = _this.registeredUsers[data.email];
		if (!user) {
			_this.registeredUsers[data.email] = data;
			_this.signUserIn(socket, data);
		} else {
			_this.cns.emit('info', {message: 'user name already exists'}, socket.id);
		}
	} else {
		_this.cns.emit('info', {message: 'incomplete user data'}, socket.id);
	}
};

UserManagement.prototype.getConnectedUserBySocketId = function(socketId){
	for(var email in this.connectedUsers){
		if (this.connectedUsers.hasOwnProperty(email)) {
			if(this.connectedUsers[email].socketId == socketId){
				return this.connectedUsers[email];
			}
		}
	}
	return null;
};

module.exports = UserManagement;