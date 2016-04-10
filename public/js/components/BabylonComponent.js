define(['knockout', 'text!templates/babylon.html', 'underscore', 'moment', 'SceneFactory', 'MaterialsService', 'TerrainTilesService', 'RenderService'],
	function (ko, template, underscore, moment, SceneFactory, MaterialsService, TerrainTilesService, RenderService) {

		var instance = null;

		var BabylonViewModelFactory = function (params, componentInfo) {
			if (!params) params = {};

			var BabylonViewModel = function (params) {
				if (!params) params = {};

				var _this = this;
				_this.socket = params.socket;
				_this.scene = null;

				// TODO find a good way to get terrain types from server
				_this.terrainTypes = ['grass', 'forest', 'mountain', 'cave', 'dirt', 'mud', 'water'];
				_this.terrainTiles = [];
				_this.materials = [];

				_this.mapTilesMeshes = [];

				_this.settings = {
					hexagonSize: 3
				};

				// factories
				_this.sceneFactory = SceneFactory.getInstance();
				// init scene
				_this.scene = this.sceneFactory.createScene();

				// services
				_this.renderService = RenderService.getInstance();

				_this.materialsService = MaterialsService.getInstance({
					scene: _this.scene
				});

				_this.terrainTilesFactory = TerrainTilesService.getInstance({
					scene: _this.scene,
					materials: _this.materialsService.materials,
					hexagonSize: _this.settings.hexagonSize
				});

				// observables
				_this.user = params.user;
				_this.currentGame = params.currentGame;

				// computed observables

				// methods
				_this.createNewGame = function () {
					console.log('telling server to create new map');
					_this.socket.emit('createNewGame', {});
				};

				_this.currentGame.subscribe(function(){
					// clear previous map - TODO find more efficient way like disposing the whole scene?
					for(var i = 0; i < _this.mapTilesMeshes.length; i++){
						_this.mapTilesMeshes[i].dispose();
					}

					// TODO init game map
					_this.renderService.initMap(_this.currentGame().map(), _this);

					// TODO init players
					_this.renderService.initPlayers(_this.currentGame().players(), _this);
				});

				// init materials
				_this.materialsService.initMaterials();
				// init terrainTiles
				_this.terrainTiles = _this.terrainTilesFactory.initTerrainTiles(_this.terrainTypes);
				console.log(_this.terrainTiles);

				// init background map for menu
				var width = 100;
				var height = 100;
				var hexagonSize = _this.settings.hexagonSize;
				var startPosX = -width * hexagonSize / 2;
				var startPosZ = height * hexagonSize / 2;
				for(var y = 0; y < height; y++){
					for(var x = 0; x < width; x++) {
						var terrainTypeIndex = _this.terrainTypes[Math.floor(Math.random() * _this.terrainTypes.length)];
						var terrainTileInstance = _this.terrainTiles[terrainTypeIndex].createInstance(terrainTypeIndex + '-' + x + '-' + y);

						var offset = (y%2 === 0) ? hexagonSize/2 : 0; // every second row with offset

						terrainTileInstance.position.x = (startPosX + x * hexagonSize + offset) * 0.9;
						terrainTileInstance.position.z = (startPosZ - y * hexagonSize) * 0.8;

						_this.mapTilesMeshes.push(terrainTileInstance);
					}
				}

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