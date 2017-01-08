'use strict';

var instance = null;

var MovementManagement = function (io, models) {
	var _this = this;

	// TODO remove unused
	_this.comService = require('../services/CommunicationService').getInstance(io);
	_this.matrixService = require('../services/MatrixService').getInstance(io);
	_this.mapFactory = require('../factories/MapFactory').getInstance();
	_this.UserModel = models.User;
	_this.GameModel = models.Game;
	_this.PlayerModel = models.Player;
	//_this.clients = io.sockets.sockets;
	_this.games = [];

	// init games
	_this.GameModel.find({}, function (err, games) {
		if (!err) {
			_this.games = games;
		} else {
			throw err;
		}
	});

	return _this;
};

/**
 * handles all MovementManagement related incoming requests
 * @param socket
 */
MovementManagement.prototype.handleIncomingEvents = function (socket) {
	var _this = this;

	socket.on('calculatePath', function (data) {
		_this.calculatePath(socket, data);
	});

};

/**
 *
 * @param socket
 * @param data
 */
MovementManagement.prototype.calculatePath = function (socket, data) {
	var _this = this;
	console.log('DEBUG - calculating path', data);
	_this.PlayerModel
		.findOne({_id: data.player})
		.populate('game')
		.exec(function (err, player) {
			if (err) {
				throw err;
			}
			var startPos = player.position,
				endPos = data.node.tile,
				path = _this.matrixService.calculatePath(startPos, endPos, player.game.map);

			// send path to all clients
			_this.comService.emit(socket, 'movePlayer', {
				path: path,
				playerId: data.player
			}, 'all');
		});
};

var getInstance = function (io, models) {
	if (!instance) {
		instance = new MovementManagement(io, models);
	}
	return instance;
};

exports.getInstance = getInstance;