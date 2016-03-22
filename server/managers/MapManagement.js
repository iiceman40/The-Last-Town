'use strict';

var instance = null;

var MapManagement = function (io, UserModel) {
	var _this = this;

	_this.comService = require('../services/CommunicationService').getInstance(io);
	_this.mapFactory = require('../factories/MapFactory').getInstance();
	_this.UserModel = UserModel;
	_this.clients = io.sockets.sockets;
	_this.maps = [];

	return _this;
};

/**
 * handles all UserManagement related incoming requests
 * @param socket
 */
MapManagement.prototype.handleIncomingEvents = function(socket){
	var _this = this;

	socket.on('createNewMap', function(data){
		_this.createNewMap(socket, data);
	});
};

/**
 * creates a new map with the MapFactory
 * @param socket
 * @param {{}} data
 * @returns {Array}
 */
MapManagement.prototype.createNewMap = function(socket, data){
	var newMapData = this.mapFactory.build();
	console.log(newMapData);

	// TODO add the user that created the map as a player
	// TODO save the complete map in the database

	this.comService.emit(socket, 'mapCreated', {message: 'map has been successfully created', messageType: 'success', mapData: newMapData}, 'all');
	return newMapData;
};

var getInstance = function(io, UserModel){
	if(!instance){
		instance = new MapManagement(io, UserModel);
	}
	return instance;
};

exports.getInstance = getInstance;