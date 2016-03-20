'use strict';

var instance = null;

var ChatService = function (io, UserModel) {
	var _this = this;

	_this.comService = require('../services/CommunicationService').getInstance(io);
	_this.UserModel = UserModel;
	_this.clients = io.sockets.sockets;

	return _this;
};

/**
 * handles all ChatService related incoming requests
 * @param socket
 */
ChatService.prototype.handleIncomingEvents = function(socket){
	var _this = this;

	socket.on('chatMessageToServer', function(data){
		_this.comService.emit(socket, 'chatMessageFromServer', data);
	});
};

var getInstance = function(io, UserModel){
	if(!instance){
		instance = new ChatService(io, UserModel);
	}
	return instance;
};

exports.getInstance = getInstance;