'use strict';

var instance = null;

var Chat = function (io, UserModel) {
	var _this = this;

	_this.comService = require('../server/CommunicationService').getInstance(io);
	_this.UserModel = UserModel;
	_this.clients = io.sockets.sockets;

	return _this;
};

/**
 * handles all Chat related incoming requests
 * @param socket
 */
Chat.prototype.handleIncomingEvents = function(socket){
	var _this = this;

	socket.on('chatMessageToServer', function(data){
		_this.comService.emit(socket, 'chatMessageFromServer', data);
	});
};

var getInstance = function(io, UserModel){
	if(!instance){
		instance = new Chat(io, UserModel);
	}
	return instance;
};

exports.getInstance = getInstance;