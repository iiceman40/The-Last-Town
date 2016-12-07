'use strict';

var instance = null;
const GAME_STATE_ACTIVE = 1;

var GameManagement = function (io, models) {
	var _this = this;

	_this.comService = require('../services/CommunicationService').getInstance(io);
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
 * handles all UserManagement related incoming requests
 * @param socket
 */
GameManagement.prototype.handleIncomingEvents = function (socket) {
	var _this = this;

	socket.on('createNewGame', function (data) {
		_this.createNewGame(socket, data);
	});

	socket.on('getGame', function (data) {
		_this.updateGame(socket, data);
	});

	socket.on('getGamesList', function (data) {
		_this.updateGamesList(socket, data);
	});

	socket.on('joinGame', function (data) {
		_this.joinGame(socket, data);
	});
};

/**
 *
 * @param user
 * @param game
 * @param position
 * @returns {PlayerModel}
 */
GameManagement.prototype.createPlayer = function (user, game, position) {
	var _this = this;
	return new _this.PlayerModel({
		user: user,
		game: game,
		name: user.name,
		level: 0,
		inventory: [],
		skills: [],
		position: position
	});
};
/**
 * creates a new map with the MapFactory
 * @param socket
 * @param {{}} data
 * @returns {Array}
 */
GameManagement.prototype.createNewGame = function (socket, data) {
	var _this = this;
	var newMapData = this.mapFactory.build(data.map);

	if (newMapData === null || !data.name) {
		console.log('ERROR - no map data for game creation');
		return null;
	}

	if (socket.user instanceof _this.UserModel === false) {
		console.log('ERROR - no user model set in current connection');
		return null;
	}

	var newGame = new _this.GameModel({
		name: data.name || 'New-Game-' + Math.floor(Math.random() * 1000000000000000),
		status: GAME_STATE_ACTIVE,
		players: [],
		map: newMapData
	});

	var newPlayer = _this.createPlayer(socket.user, newGame, newMapData.townPosition);

	newGame.players.push(newPlayer);
	_this.games.push(newGame);

	newPlayer.save(function (err, player) {
		if (err) return console.error(err);
	});

	newGame.save(function (err, game) {
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
GameManagement.prototype.updateGame = function (socket, data) {
	var _this = this;
	_this.GameModel
		.findOne({_id: data.game._id})
		.populate('players')
		.exec(function (err, game) {
			if (err) return console.error(err);
			if (game instanceof _this.GameModel) {
				_this.comService.emit(socket, 'updateGame', {
					message: {text: 'game has been loaded', type: 'success'},
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
GameManagement.prototype.updateGamesList = function (socket, data, all) {
	var _this = this;
	_this.GameModel
		.find({})
		.populate('players')
		.exec(function (err, games) {
			if (err) return console.error(err);
			_this.comService.emit(socket, 'updateGamesList', {
				message: {text: 'games list has been updated', type: 'success'},
				games: games
			}, all ? 'all' : socket.id);
		});
};

/**
 *
 * @param socket
 * @param {{game: ObjectId, user: ObjectId}} data
 */
GameManagement.prototype.joinGame = function (socket, data) {
	var _this = this;
	_this.GameModel.findOne({_id: data.game._id}, function (err, game) {
		_this.PlayerModel.findOne({
			'game': game._id,
			'user': socket.user._id
		}, function (err, player) {
			if (err) return console.error(err);
			if (player instanceof _this.PlayerModel === false) {
				var player = _this.createPlayer(socket.user, game, game.map.townPosition);
				player.save(function (err, player) {
					game.players.push(player._id);
					game.save(function (err, game) {
						if (err) return console.error(err);
						var all = true;
						_this.updateGamesList(socket, data, all);
					});
				});
			}
			_this.updateGame(socket, data);
		});
	});
};

var getInstance = function (io, models) {
	if (!instance) {
		instance = new GameManagement(io, models);
	}
	return instance;
};

exports.getInstance = getInstance;