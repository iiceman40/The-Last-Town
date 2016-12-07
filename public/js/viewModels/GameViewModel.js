'use strict';

define(['knockout', 'underscore', 'PlayerViewModel'], function (ko, _, PlayerViewModel) {

	var GameViewModel = function (data) {
		if (!data) data = {};

		// init player view models
		data.players = _.map(data.players, function(playerData){
			return new PlayerViewModel(playerData);
		});

		this.map = ko.observable(data.map);
		this.players = ko.observableArray(data.players || []);

		// computed observable
	};

	return GameViewModel;
});