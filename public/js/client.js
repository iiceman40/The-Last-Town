'use strict';

require.config({
	baseUrl: "/",
	shim: {
		'socketio': {
			exports: 'io'
		},
		'bootstrap': {
			deps: ['jquery']
		}
	},
	paths: {
		// VENDOR
		'text':                     'modules/text/text',
		'socket.io':                'socket.io/socket.io',
		'underscore':               'modules/underscore/underscore-min',
		'moment':                   'modules/moment/min/moment.min',
		'jquery':                   'modules/jquery/dist/jquery',
		'knockout':                 'modules/knockout/build/output/knockout-latest',
		'knockout-postbox':         'modules/knockout-postbox/build/knockout-postbox.min',
		'babylonjs':                'modules/babylonjs/babylon.max',
		'bootstrap':                'modules/bootstrap/dist/js/bootstrap.min',
		// VIEW MODELS
		'MainViewModel':            'js/viewModels/MainViewModel',
		'UserViewModel':            'js/viewModels/UserViewModel',
		'MessageViewModel':         'js/viewModels/MessageViewModel',
		'FlashMessageViewModel':    'js/viewModels/FlashMessageViewModel',
		'GameViewModel':            'js/viewModels/GameViewModel',
		// FACTORIES
		'SceneFactory':             'js/factories/SceneFactory',
		// COMPONENTS
		'UsersListComponent':       'js/components/UsersListComponent',
		'FlashMessagesComponent':   'js/components/FlashMessagesComponent',
		'LoginComponent':           'js/components/LoginComponent',
		'ProfileComponent':         'js/components/ProfileComponent',
		'ChatComponent':            'js/components/ChatComponent',
		'GamesListComponent':       'js/components/GamesListComponent',
		'BabylonComponent':         'js/components/BabylonComponent',
		'MenuBarComponent':         'js/components/MenuBarComponent'
	}

});

// MAIN SCRIPT
require(['knockout', 'MainViewModel'], function(ko, MainViewModel) {
	ko.applyBindings(new MainViewModel());
});