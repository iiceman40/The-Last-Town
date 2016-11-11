define([
	'knockout', 'text!templates/game/edit-map.html', 'GameViewModel', 'FlashMessageViewModel', 'SelectedNodeViewModel', 'BabylonComponent',
	'TerrainTilesService', 'TilesRenderService'
	],
	function (ko, template, GameViewModel, FlashMessageViewModel, SelectedNodeViewModel, BabylonComponent, TerrainTilesService, TilesRenderService) {

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

				ko.postbox.subscribe("selectTile", function(data) {
					console.log('select Tile', data);
					var terrainTilesService = TerrainTilesService.getInstance(),
						tilesRenderService = TilesRenderService.getInstance(),
						selectDisc = terrainTilesService.getSelectDisc(),
						SPS = tilesRenderService.solidParticleSystemsByMeshName[data.meshName];

					if(SPS === undefined && pickResult.pickedMesh){
						// FIXME check what gets hit if SPS is undefined
						console.log('SPS undefined', pickResult.pickedMesh.name)
					}

					if (data.meshFaceId == -1 || SPS === undefined) { return; }

					var idx = SPS.pickedParticles[data.meshFaceId].idx,
						p   = SPS.particles[idx];

					_this.selectedNode(new SelectedNodeViewModel(p.tile, p, _this.babylonViewModel));

					selectDisc.isVisible = true;
					selectDisc.position = p.position.clone().add(data.meshPosition);
					selectDisc.position.y = 0.005;
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