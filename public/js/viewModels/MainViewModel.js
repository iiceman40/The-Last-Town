'use strict';

define([
	'knockout',
	'socket.io',
	'UserViewModel',
	'UsersListComponent',
	'LoginComponent',
	'ChatComponent',
	'MapsComponent'
],
function(ko, io, UserViewModel, UsersListComponent, LoginComponent, ChatComponent, MapsComponent) {

	return function MainViewModel(params) {
		var _this = this;
		_this.socket = io();

		// main observables
		_this.user = ko.observable(new UserViewModel());
		_this.connectedUsers = ko.observableArray([]);

		// computed observables

		// methods

		// register components
		ko.components.register('login', LoginComponent);
		ko.components.register('users-list', UsersListComponent);
		ko.components.register('chat', ChatComponent);
		ko.components.register('maps', MapsComponent);
		// TODO make separate component for flash messages
	};
});