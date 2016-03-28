define(['knockout', 'text!templates/maps.html', 'underscore', 'moment'],
	function (ko, template, moment) {

		var instance = null;

		var MapsViewModelFactory = function (params, componentInfo) {
			if (!params) params = {};

			var MapsViewModel = function (params) {
				if (!params) params = {};

				var _this = this;
				_this.socket = params.socket;

				// observables
				_this.user = params.user;
				_this.connectedUsers = params.connectedUsers;

				// computed observables

				// methods
				_this.createNewMap = function () {
					console.log('telling server to create new map');
					_this.socket.emit('createNewMap', {});
				};

				// events
				_this.socket.on('mapCreated', function (data) {
					console.log('map has been created', data);
				});

			};

			if (!instance) {
				instance = new MapsViewModel(params);
			}

			return instance;
		};

		return {
			viewModel: {
				createViewModel: MapsViewModelFactory
			},
			template: template
		};

	}
);