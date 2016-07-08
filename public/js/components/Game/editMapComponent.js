define(['knockout', 'text!templates/game/edit-map.html', 'GameViewModel', 'FlashMessageViewModel', 'SelectedNodeViewModel', 'BabylonComponent'],
	function (ko, template, GameViewModel, FlashMessageViewModel, SelectedNodeViewModel, BabylonComponent) {

		var instance = null;

		var EditMapViewModelFactory = function (params, componentInfo) {
			if (!params) params = {};

			var EditMapViewModel = function (params) {
				if (!params) params = {};

				var _this = this;
				_this.socket = params.socket;

				// observable array

				// observables
				_this.isActive = ko.observable(false).subscribeTo('editMapIsActive');
				_this.configNewGameIsActive = ko.observable(false);
				_this.user = params.user;
				_this.currentGame = params.currentGame;
				_this.connectedUsers = params.connectedUsers;

				_this.babylonViewModel = BabylonComponent.viewModel.createViewModel();
				_this.scene = _this.babylonViewModel.scene;

				_this.terrainTypes = ko.observableArray(_this.babylonViewModel.terrainTypes);
				_this.selectedNode = ko.observable();

				ko.postbox.subscribe("selectTile", function(p) {
					_this.selectedNode(new SelectedNodeViewModel(p.tile, p, _this.babylonViewModel));
				}, this);

			};

			if (!instance) {
				instance = new EditMapViewModel(params);
			}

			return instance;
		};

		return {
			viewModel: {
				createViewModel: EditMapViewModelFactory
			},
			template: template
		};

	}
);