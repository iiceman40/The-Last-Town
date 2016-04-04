'use strict';

define(['knockout'], function (ko) {

	var GameViewModel = function (data) {
		if (!data) data = {};

		this.map = ko.observable(data.map);
		this.players = ko.observableArray(data.players || []);

		// computed observable
	};

	return GameViewModel;
});