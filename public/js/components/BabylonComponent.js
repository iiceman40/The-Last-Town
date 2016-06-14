define(['knockout', 'text!templates/babylon.html', 'underscore', 'moment', 'SceneFactory', 'MaterialsService', 'TerrainTilesService', 'RenderingService', 'pepjs'],
	function (ko, template, underscore, moment, SceneFactory, MaterialsService, TerrainTilesService, RenderingService, pepjs) {

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

				// factories
				_this.sceneFactory = SceneFactory.getInstance();
				// init scene
				_this.scene = this.sceneFactory.createScene();

				// services
				_this.materialsService = MaterialsService.getInstance({
					scene: _this.scene
				});
				// init materials
				_this.materialsService.initMaterials();

				_this.terrainTilesFactory = TerrainTilesService.getInstance({
					scene: _this.scene,
					materials: _this.materialsService.materials,
					hexagonSize: _this.settings.hexagonSize
				});

				_this.renderingService = RenderingService.getInstance();

				// observables
				_this.user = params.user;
				_this.currentGame = params.currentGame;

				// computed observables

				// methods
				_this.createNewGame = function () {
					_this.socket.emit('createNewGame', {});
				};

				_this.currentGame.subscribe(function(currentGame){
					_this.map = currentGame.map();
					// clear previous map
					for(var i = 0; i < _this.mapTilesMeshes.length; i++){
						_this.mapTilesMeshes[i].dispose();
					}

					// init game map
					_this.renderingService.initMap(_this);

					// TODO init players
					//_this.renderingService.initPlayers(_this.currentGame().players(), _this);

				});

				// init terrain types
				_this.socket.emit('getTerrainTypes', {});
				_this.socket.on('updateTerrainTypes', function (data) {
					_this.terrainTypes = Object.keys(data.terrainTypes);
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
					mapData.width = 10;
					mapData.height = 10;
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
					_this.map = mapData;

					_this.renderingService.initMap(_this);

				});

				// init interactions highlighting
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