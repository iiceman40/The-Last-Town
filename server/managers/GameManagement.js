'use strict';

var instance = null;

var GameManagement = function (io, models) {
	var _this = this;

	_this.comService = require('../services/CommunicationService').getInstance(io);
	_this.mapFactory = require('../factories/MapFactory').getInstance();
	_this.UserModel = models.User;
	_this.GameModel = models.Game;
	//_this.clients = io.sockets.sockets;
	_this.games = [];

	// init games
	_this.GameModel.find({}, function(err, games) {
		if (!err){
			_this.games = games;
		} else {throw err;}
	});

	return _this;
};

/**
 * handles all UserManagement related incoming requests
 * @param socket
 */
GameManagement.prototype.handleIncomingEvents = function(socket){
	var _this = this;

	socket.on('createNewGame', function(data){
		_this.createNewGame(socket, data);
	});

	socket.on('getGamesList', function(data){
		_this.updateGamesList(socket, data);
	});
};

/**
 * creates a new map with the MapFactory
 * @param socket
 * @param {{}} data
 * @returns {Array}
 */
GameManagement.prototype.createNewGame = function(socket, data){
	console.log('creating new game');
	var _this = this;
	var newMapData = this.mapFactory.build(data.map);

	if(newMapData === null || !data.name){
		return null;
	}

	// TODO use database model for players?
	var player = {
		name: socket.user.name,
		userId: socket.user._id,
		level: 0,
		inventory: [],
		skills: []
	};

	var newGame = new _this.GameModel({
		name:           data.name || 'New-Game-' + Math.floor(Math.random() * 1000000000000000),
		status:         1,          // TODO use constants 1 - new game
		players:        [player],   // [new Player(socket.user)]
		map:            newMapData
	});

	_this.games.push(newGame);

	newGame.save(function (err, user) {
		if (err) return console.error(err);

		var all = true;
		_this.updateGamesList(socket, data, all);
	});

	return newGame;
};

/**
 * 
 * @param socket
 * @param data
 * @param {boolean} all
 */
GameManagement.prototype.updateGamesList = function(socket, data, all){
	var _this = this;
	_this.comService.emit(socket, 'gamesList', {
		message: {text:'games list has been updated', type: 'success'},
		games: _this.games
	}, all ? 'all' : socket.id);
};

var getInstance = function(io, models){
	if(!instance){
		instance = new GameManagement(io, models);
	}
	return instance;
};

exports.getInstance = getInstance;