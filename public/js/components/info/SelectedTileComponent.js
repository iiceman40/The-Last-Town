define([
		'knockout', 'text!templates/info/selected-tile.html', 'GameViewModel', 'FlashMessageViewModel', 'SelectedNodeViewModel', 'BabylonComponent',
		'SelectTileService', 'TerrainTilesService', 'HighlightService'
	],
	function (
		ko, template, GameViewModel, FlashMessageViewModel, SelectedNodeViewModel, BabylonComponent,
		SelectTileService, TerrainTilesService, HighlightService
	) {

		var instance = null;

		var SelectedTileViewModelFactory = function (params, componentInfo) {
			if (!params) params = {};

			var SelectedTileViewModel = function (params) {
				if (!params) params = {};

				var _this = this;
				_this.socket = params.socket;

				// observables
				_this.isActive = ko.observable(false).subscribeTo('selectedTileIsActive');
				_this.configNewGameIsActive = ko.observable(false);
				_this.selectedNode = ko.observable();

				_this.babylonViewModel = BabylonComponent.viewModel.createViewModel();

				// observable arrays
				_this.terrainTypes = ko.observableArray(_this.babylonViewModel.terrainTypes);

				// services
				_this.terrainTilesService = TerrainTilesService.getInstance();
				_this.selectTileService = SelectTileService.getInstance({
					babylonViewModel: _this.babylonViewModel
				});
				_this.highlightService = HighlightService.getInstance({
					babylonViewModel: _this.babylonViewModel
				});

				// subscriptions
				ko.postbox.subscribe("selectTile", function(data) {
					var node = _this.selectTileService.pickTileByParticleData(data);

					if(node instanceof SelectedNodeViewModel) {
						_this.highlightService.selectTile(node, data);
						_this.selectedNode(node);

						if(_this.babylonViewModel.currentGame() instanceof GameViewModel) {
							// request a path for the current player to this tile
							_this.socket.emit('calculatePath', {
								game: _this.babylonViewModel.currentGame()._id(),
								player: _this.babylonViewModel.myPlayer()._id(),
								node: _this.selectedNode().toDto()
							});
						}
					}
				}, this);

				/**
				 * todo transfer to animation or movement service
				 */
				_this.socket.on('movePlayer', function (data) {
					// TODO separate events into path calculation and movement
					// TODO add function to HighlightService to show PathMarkers to illustrate a path returned from the server
					for (var i = 0; i < data.path.length; i++) {
						var coordsArray = data.path[i],
							coords = {x: coordsArray[0], y: coordsArray[1]};

						var player = _this.babylonViewModel.currentGame().players()[data.playerId];
						var playerAvatar = player.avatar;
						var map = _this.babylonViewModel.currentGame().map();
						var tile = map.matrix[coords.y][coords.x];

						// update position in player model
						player.position(coords);

						// offset of the map - TODO move to MapService - replica from player initialization
						var startPosition = new BABYLON.Vector3(
							-map.width * _this.babylonViewModel.settings.hexagonSize / 2,
							0,
							-map.height * _this.babylonViewModel.settings.hexagonSize / 2
						);

						// place player avatar - TODO put in separate function placePlayerOnTile ... in tile service? player service?
						playerAvatar.position = tile.position.add(startPosition);
						playerAvatar.position.x += 0.7;
						playerAvatar.position.z -= 0.7;
						playerAvatar.position.y += tile.position.y;

						// TODO move player along the given path - animation
						// TODO update player avatar position accordingly
					}
				});

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