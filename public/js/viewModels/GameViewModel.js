'use strict';

define(['knockout', 'underscore', 'PlayerViewModel'], function (ko, _, PlayerViewModel) {

	var GameViewModel = function (data) {
		if (!data) data = {};

		var _this = this;

		// init players index with player view models
		this._playersByPlayerId = {};
		this._playersByUserId = {};

		_.each(data.players, function(playerData){
			/** @type {PlayerViewModel} player */
			var player = new PlayerViewModel(playerData);
			_this._playersByPlayerId[playerData._id] = player;
			_this._playersByUserId[playerData.user] = player;
		});
		this.players = ko.observable(this._playersByPlayerId);

		this._id = ko.observable(data._id);
		this.map = ko.observable(data.map);

		// computed observable
	};

	/**
	 *
	 * @param {PlayerViewModel} player
	 */
	GameViewModel.prototype.addPlayer = function(player) {
		var _players = this.players();
		_players[player._id()] = player;
		this.players(_players);
	};

	/**
	 *
	 * @param {string} userId
	 * @returns {{PlayerViewModel}|null}
	 */
	GameViewModel.prototype.getPlayerByUserId = function (userId) {
		return _.has(this._playersByUserId, userId) ? this._playersByUserId[userId] : null;
	};

	return GameViewModel;
});