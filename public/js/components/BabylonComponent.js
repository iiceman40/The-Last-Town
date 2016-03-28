define(['knockout', 'text!templates/babylon.html', 'underscore', 'moment', 'SceneFactory'],
	function (ko, template, underscore, moment, SceneFactory) {

		var instance = null;

		var BabylonViewModelFactory = function (params, componentInfo) {
			if (!params) params = {};

			var BabylonViewModel = function (params) {
				if (!params) params = {};

				var _this = this;
				_this.socket = params.socket;

				// observables
				_this.user = params.user;

				// computed observables

				// methods
				_this.createNewMap = function () {
					console.log('telling server to create new map');
					_this.socket.emit('createNewMap', {});
				};

				// events
				//_this.socket.on('mapCreated', function (data) {
				//	console.log('map has been created', data);
				//});

				var sceneFactory = SceneFactory.getInstance();
				sceneFactory.createScene();

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