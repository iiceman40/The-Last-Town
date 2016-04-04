define(['knockout', 'text!templates/babylon.html', 'underscore', 'moment', 'SceneFactory'],
	function (ko, template, underscore, moment, SceneFactory) {

		var instance = null;

		var BabylonViewModelFactory = function (params, componentInfo) {
			if (!params) params = {};

			var BabylonViewModel = function (params) {
				if (!params) params = {};

				var _this = this;
				_this.socket = params.socket;
				_this.scene = null;

				// observables
				_this.user = params.user;
				_this.currentGame = params.currentGame;

				// computed observables

				// methods
				_this.createNewGame = function () {
					console.log('telling server to create new map');
					_this.socket.emit('createNewGame', {});
				};

				var sceneFactory = SceneFactory.getInstance();
				_this.scene = sceneFactory.createScene();

				_this.currentGame.subscribe(function(){
					console.log('game changed', _this.currentGame().map());

					// TODO
				});
			};

			if (!instance) {
				instance = new BabylonViewModel(params);
			}

			return instance;
		};

		return {
			viewModel: {
				createViewModel: BabylonViewModelFactory
			},
			template: template
		};

	}
);