'use strict';

define([
		'knockout', 'socket.io', 'UserViewModel', 'FlashMessagesComponent', 'UsersListComponent', 'LoginComponent',
		'ProfileComponent', 'ChatComponent', 'ListGamesComponent', 'NewGameComponent', 'BabylonComponent', 'MenuBarComponent'
	],
	function (ko, io, UserViewModel, FlashMessagesComponent, UsersListComponent, LoginComponent,
	          ProfileComponent, ChatComponent, ListGamesComponent, NewGameComponent, BabylonComponent, MenuBarComponent) {

		return function MainViewModel() {
			var _this = this;
			_this.socket = io();

			// main observables
			_this.user = ko.observable(new UserViewModel());
			_this.currentGame = ko.observable();
			_this.connectedUsers = ko.observableArray([]);

			// TODO use a game Singleton Object to handle game states
			// TODO menu for creating and selecting maps before a game started
			// TODO menu for profile
			// TODO render map in Map3d Object
			// TODO use Player Objects

			// register components
			ko.components.register('flash-messages', FlashMessagesComponent);
			ko.components.register('users-list', UsersListComponent);
			ko.components.register('profile', ProfileComponent);
			ko.components.register('login', LoginComponent);
			ko.components.register('chat', ChatComponent);
			ko.components.register('list-games', ListGamesComponent);
			ko.components.register('new-game', NewGameComponent);
			ko.components.register('babylon', BabylonComponent);
			ko.components.register('menu-bar', MenuBarComponent);
			// TODO create a component for the menu bar
		};
	}
);