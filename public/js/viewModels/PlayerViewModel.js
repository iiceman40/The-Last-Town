'use strict';

define(['knockout'], function (ko) {
	var PlayerViewModel = function (data) {
		if (!data) data = {};

		this._id       = ko.observable(data._id || '');
		this.position  = ko.observable(data.position || {});
		this.game      = ko.observable(data.game || '');
		this.name      = ko.observable(data.name || '');
		this.level     = ko.observable(data.level || 0);
		this.user      = ko.observable(data.user || '');
		this.inventory = ko.observableArray(data.inventory || []);
		this.skills    = ko.observableArray(data.skills || []);

		this.avatar    = data.avatar || null;

	};

	return PlayerViewModel;
});