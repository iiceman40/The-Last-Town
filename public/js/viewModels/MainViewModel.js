'use strict';

define([
		'knockout', 'socket.io', 'UserViewModel', 'FlashMessagesComponent', 'UsersListComponent', 'LoginComponent',
		'ProfileComponent', 'ChatComponent', 'MapsComponent'
	],
	function (ko, io, UserViewModel, FlashMessagesComponent, UsersListComponent, LoginComponent,
	          ProfileComponent, ChatComponent, MapsComponent) {

		return function MainViewModel() {
			var _this = this;
			_this.socket = io();

			// main observables
			_this.user = ko.observable(new UserViewModel());
			_this.connectedUsers = ko.observableArray([]);

			// register components
			ko.components.register('flash-messages', FlashMessagesComponent);
			ko.components.register('users-list', UsersListComponent);
			ko.components.register('profile', ProfileComponent);
			ko.components.register('login', LoginComponent);
			ko.components.register('chat', ChatComponent);
			ko.components.register('maps', MapsComponent);
		};
	}
);