'use strict';

define(['knockout'], function(ko) {
	// UserViewModel model
	return function(data){
		this.CONNECTION_STATUS_DISCONNECTED = 0;
		this.CONNECTION_STATUS_CONNECTED = 1;
		this.LOGIN_STATUS_LOGGED_OUT = 0;
		this.LOGIN_STATUS_LOGGED_IN = 1;

		this.name = ko.observable('');
		this.email = ko.observable('');
		this.password = ko.observable('');
		this.connectionStatus = ko.observable(this.CONNECTION_STATUS_DISCONNECTED);
		this.loginStatus = ko.observable(this.LOGIN_STATUS_LOGGED_OUT);
	};
});