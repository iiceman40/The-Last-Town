'use strict';

define(['knockout'], function (ko) {
	var UserViewModel = function (data) {
		if (!data) data = {};

		this._id              = ko.observable(data._id || '');
		this.name             = ko.observable(data.name || '');
		this.email            = ko.observable(data.email || '');
		this.password         = ko.observable(data.password || '');
		this.rememberMe       = ko.observable(data.rememberMe || true);
		this.connectionStatus = ko.observable(this.CONNECTION_STATUS_DISCONNECTED);
		this.loginStatus      = ko.observable(this.LOGIN_STATUS_LOGGED_OUT);

		// computed observable
		this.isOnline = ko.computed(function () {
			return this.connectionStatus() && this.loginStatus();
		}, this);
	};

	UserViewModel.prototype.CONNECTION_STATUS_DISCONNECTED = 0;
	UserViewModel.prototype.CONNECTION_STATUS_CONNECTED = 1;
	UserViewModel.prototype.LOGIN_STATUS_LOGGED_OUT = 0;
	UserViewModel.prototype.LOGIN_STATUS_LOGGED_IN = 1;

	return UserViewModel;
});