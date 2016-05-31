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

				// TODO don't use mainTownTile, create a tile improvement instead

				_this.terrainTypes = [];
				_this.terrainTiles = [];
				_this.materials = [];

				_this.mapTilesMeshes = [];

				_this.settings = {
					hexagonSize: 3
				};

				// init terrain types
				_this.socket.emit('getTerrainTypes', {});
				_this.socket.on('updateTerrainTypes', function (data) {
					_this.terrainTypes = Object.keys(data.terrainTypes);
					console.log(_this.terrainTypes);
					// init terrainTiles
					_this.terrainTiles = _this.terrainTilesFactory.initTerrainTiles(_this.terrainTypes, _this);
					// TODO move to separate function that gets called on first time change of _this.terrainTypes/Tiles
					// init background map for menu
					// TODO get placeholder terrain types from server or terrain types
					var placeholderTerrainTypes = [
						'grass', 'grass', 'grass', 'grass',
						'forest', 'forest', 'forest', 'forest', 'forest', 'forest', 'forest', 'forest','forest',
						'mountain', 'mountain', 'mountain',
						'cave', 'cave', 'cave',
						'dirt', 'dirt', 'dirt', 'dirt', 'dirt',
						'mud', 'mud',
						'water'];
					var mapData = {};
					mapData.width = 100;
					mapData.height = 100;
					mapData.matrix = [];
					mapData.indexedTiles = {};
					var indexedTiles = mapData.indexedTiles;
					for(var y = 0; y < mapData.height; y++){
						mapData.matrix[y] = [];
						for(var x = 0; x < mapData.width; x++) {
							var newTerrainType = placeholderTerrainTypes[Math.floor(Math.random() * placeholderTerrainTypes.length)];
							mapData.matrix[y][x] = {};
							mapData.matrix[y][x].terrain = newTerrainType;
							mapData.matrix[y][x].x = x;
							mapData.matrix[y][x].y = y;

							var terrainType = mapData.matrix[y][x].terrain;
							if(!indexedTiles.hasOwnProperty(terrainType)) {
								indexedTiles[terrainType] = [];
							}
							indexedTiles[terrainType].push(mapData.matrix[y][x]);
						}
					}

					_this.renderService.initMap(mapData, _this);
				});

				// factories
				_this.sceneFactory = SceneFactory.getInstance();
				// init scene
				_this.scene = this.sceneFactory.createScene();

				// services
				_this.materialsService = MaterialsService.getInstance({
					scene: _this.scene
				});

				_this.terrainTilesFactory = TerrainTilesService.getInstance({
					scene: _this.scene,
					materials: _this.materialsService.materials,
					hexagonSize: _this.settings.hexagonSize
				});

				_this.renderService = RenderService.getInstance();

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

				_this.terrainTilesFactory.initSelectDisc();
				_this.terrainTilesFactory.initHoverDisc();

				//_this.scene.activeCamera.setPosition(new BABYLON.Vector3(20, 12, 6));

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