'use strict';

var instance = null;
const GAME_STATE_ACTIVE = 1;

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

	socket.on('getGame', function(data){
		_this.updateGame(socket, data);
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
		status:         GAME_STATE_ACTIVE,
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
 */
GameManagement.prototype.updateGame = function(socket, data){
	var _this = this;
	var query  = _this.GameModel.where({_id: data.game._id});
	query.findOne(function (err, game) {
		if (err) return console.error(err);
		if (game) {
			_this.comService.emit(socket, 'updateGame', {
				message: {text:'game has been loaded', type: 'success'},
				game: game
			}, socket.id);
		}
	});
};

/**
 * 
 * @param socket
 * @param data
 * @param {boolean} all
 */
GameManagement.prototype.updateGamesList = function(socket, data, all){
	var _this = this;
	var gamesList = [];

	_this.GameModel.find({}, function(err, games) {
		if (!err){
			for(var i = 0; i < games.length; i++){
				var game = games[i];
				gamesList.push({
					_id: game._id,
					name: game.name,
					players: game.players,
					status:game.status,
					map: {
						height: game.map.height,
						width: game.map.width,
						seed: game.map.seed
					}
				})
			}

			_this.comService.emit(socket, 'updateGamesList', {
				message: {text:'games list has been updated', type: 'success'},
				games: gamesList
			}, all ? 'all' : socket.id);
		} else {throw err;}
	});
};

var getInstance = function(io, models){
	if(!instance){
		instance = new GameManagement(io, models);
	}
	return instance;
};

exports.getInstance = getInstance;