'use strict';

require.config({
	baseUrl: "/",
	shim: {
		'socketio': {
			exports: 'io'
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
		'babylonjs':                'modules/babylonjs/babylon.max',
		// VIEW MODELS
		'MainViewModel':            'js/viewModels/MainViewModel',
		'UserViewModel':            'js/viewModels/UserViewModel',
		'MessageViewModel':         'js/viewModels/MessageViewModel',
		// FACTORIES
		'SceneFactory':             'js/factories/SceneFactory',
		// COMPONENTS
		'UsersListComponent':       'js/components/UsersListComponent',
		'LoginComponent':           'js/components/LoginComponent',
		'ChatComponent':            'js/components/ChatComponent',
		'MapsComponent':            'js/components/MapsComponent'
	}

});

// MAIN SCRIPT
require(['knockout', 'MainViewModel'], function(ko, MainViewModel) {
	ko.applyBindings(new MainViewModel());
});

// TODO implement rendering
//require(['SceneFactory'], function(SceneFactory) {
	//console.log(SceneFactory);
	//var sceneFactory = SceneFactory.getInstance();
	//sceneFactory.createScene();
//});