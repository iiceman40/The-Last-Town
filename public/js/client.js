'use strict';

require.config({
	baseUrl: "/",
	paths: {
		// VENDOR
		text: '/modules/text/text',
		underscore: 'modules/underscore/underscore-min',
		jquery: 'modules/jquery/dist/jquery',
		knockout: 'modules/knockout/build/output/knockout-latest',
		babylonjs: 'modules/babylonjs/babylon.max',
		// VIEW MODELS
		MainViewModel: 'js/models/MainViewModel',
		// FACTORIES
		SceneFactory: 'js/factories/SceneFactory',
		// COMPONENTS
		MessageEditor: 'js/components/MessageEditorComponent'
	}

});

// MAIN SCRIPT
require(['knockout', 'MainViewModel'], function(ko, MainViewModel) {
	ko.applyBindings(new MainViewModel());
});

//require(['SceneFactory'], function(SceneFactory) {
	//console.log(SceneFactory);
	//var sceneFactory = SceneFactory.getInstance();
	//sceneFactory.createScene();
//});