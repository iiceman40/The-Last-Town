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
				// TODO don't use mainTownTile, create a tile improvement instead
				_this.terrainTypes = ['grass', 'forest', 'mountain', 'cave', 'dirt', 'mud', 'water', 'mainTownTile'];
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
					// clear previous map
					for(var i = 0; i < _this.mapTilesMeshes.length; i++){
						_this.mapTilesMeshes[i].dispose();
					}

					// re-init terrainTiles
					_this.terrainTiles = _this.terrainTilesFactory.initTerrainTiles(_this.terrainTypes, _this);
					// init game map
					_this.renderService.initMap(_this.currentGame().map(), _this);
					// TODO init players
					//_this.renderService.initPlayers(_this.currentGame().players(), _this);
				});

				// init materials
				_this.materialsService.initMaterials();

				// init terrainTiles
				_this.terrainTiles = _this.terrainTilesFactory.initTerrainTiles(_this.terrainTypes, this);

				_this.terrainTilesFactory.initSelectDisc();
				_this.terrainTilesFactory.initHoverDisc();

				_this.scene.activeCamera.setPosition(new BABYLON.Vector3(20, 12, 6));

				// init background map for menu
				var placeholderTerrainTypes = [
					'grass', 'grass', 'grass', 'grass',
					'forest', 'forest', 'forest', 'forest', 'forest', 'forest', 'forest', 'forest','forest',
					'mountain', 'mountain', 'mountain',
					'cave', 'cave', 'cave',
					'dirt', 'dirt', 'dirt', 'dirt', 'dirt',
					'mud', 'mud',
					'water'];
				var map = {};
				map.width = 80;
				map.height = 50;
				map.matrix = [];
				for(var y = 0; y < map.height; y++){
					map.matrix[y] = [];
					for(var x = 0; x < map.width; x++) {
						map.matrix[y][x] = {};
						map.matrix[y][x].terrain = placeholderTerrainTypes[Math.floor(Math.random() * placeholderTerrainTypes.length)];
					}
				}

				_this.renderService.initMap(map, _this);

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