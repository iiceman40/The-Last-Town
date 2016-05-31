'use strict';

var instance = null;

var SharedDataService = function (io) {
	var _this = this;

	_this.comService = require('../services/CommunicationService').getInstance(io);
	_this.terrainRepository = require('../repositories/TerrainRepository').getInstance();
	_this.improvementRepository = require('../repositories/improvementRepository').getInstance();
	_this.clients = io.sockets.sockets;

	return _this;
};

/**
 * provides data from repositories to the client
 * @param socket
 */
SharedDataService.prototype.handleIncomingEvents = function(socket){
	var _this = this;

	socket.on('getTerrainTypes', function(data){
		_this.comService.emit(socket, 'updateTerrainTypes', {
			terrainTypes: _this.terrainRepository.terrainTypes
		}, socket.id);
	});

	socket.on('getImprovementTypes', function(data){
		_this.comService.emit(socket, 'updateImprovementTypes', {
			terrainTypes: _this.improvementRepository.improvementTypes
		}, socket.id);
	});
};

var getInstance = function(io, UserModel){
	if(!instance){
		instance = new SharedDataService(io, UserModel);
	}
	return instance;
};

exports.getInstance = getInstance;