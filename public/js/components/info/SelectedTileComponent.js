define([
		'knockout', 'text!templates/info/selected-tile.html', 'GameViewModel', 'FlashMessageViewModel', 'SelectedNodeViewModel', 'BabylonComponent',
		'SelectTileService'
	],
	function (ko, template, GameViewModel, FlashMessageViewModel, SelectedNodeViewModel, BabylonComponent, SelectTileService) {

		var instance = null;

		var SelectedTileViewModelFactory = function (params, componentInfo) {
			if (!params) params = {};

			var SelectedTileViewModel = function (params) {
				if (!params) params = {};

				var _this = this;
				_this.socket = params.socket;

				// observable array

				// observables
				_this.isActive = ko.observable(false).subscribeTo('selectedTileIsActive');
				_this.configNewGameIsActive = ko.observable(false);
				_this.user = params.user;
				_this.currentGame = params.currentGame;
				_this.connectedUsers = params.connectedUsers;

				_this.babylonViewModel = BabylonComponent.viewModel.createViewModel();
				_this.scene = _this.babylonViewModel.scene;

				_this.terrainTypes = ko.observableArray(_this.babylonViewModel.terrainTypes);
				_this.selectedNode = ko.observable();

				_this.selectTileService = SelectTileService.getInstance({
					babylonViewModel: _this.babylonViewModel
				});

				ko.postbox.subscribe("selectTile", function(data) {
					var node = _this.selectTileService.pickTileByParticleData(data);
					_this.selectedNode(node);
				}, this);

			};

			if (!instance) {
				instance = new SelectedTileViewModel(params);
			}

			return instance;
		};

		return {
			viewModel: {
				createViewModel: SelectedTileViewModelFactory
			},
			template: template
		};

	}
);