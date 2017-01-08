'use strict';

define(['knockout', 'text!templates/babylon.html', 'underscore', 'moment', 'SceneFactory',
		'MaterialsService', 'TerrainTilesService', 'MapService', 'RenderingService', 'pepjs'],
	function (ko, template, _, moment, SceneFactory,
	          MaterialsService, TerrainTilesService, MapService, RenderingService, pepjs) {

		var instance = null;

		var BabylonViewModelFactory = function (params, componentInfo) {
			if (!params) params = {};

			var BabylonViewModel = function (params) {
				if (!params) params = {};

				var _this = this;
				_this.socket = params.socket;
				_this.scene = null;
				_this.debug = ko.observable(false).syncWith("debug");

				// TODO don't use mainTownTile, create a tile improvement instead

				_this.terrainTypes = [];
				_this.terrainTiles = [];
				_this.materials = [];

				_this.mapTilesMeshes = [];

				_this.settings = {
					baseTileHeight: 1,
					hexagonSize: 3
				};

				_this.debug.subscribe(function(newValue){
					if(newValue){
						_this.scene.debugLayer.show();
					} else {
						_this.scene.debugLayer.hide();
					}
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
					hexagonSize: _this.settings.hexagonSize
				});

				_this.renderingService = RenderingService.getInstance();
				_this.mapService = MapService.getInstance();

				// observables
				_this.user        = params.user;
				_this.currentGame = params.currentGame;
				_this.myPlayer    = null;

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
					_this.map.indexedTiles = _this.mapService.indexTilesByType(_this.map);
					_this.renderingService.initMap(_this);
					_this.renderingService.initPlayers(_this);

				});

				// init terrain types
				_this.socket.emit('getTerrainTypes', {});
				_this.socket.on('updateTerrainTypes', function (data) {
					_this.terrainTypes = Object.keys(data.terrainTypes);
					_this.map = _this.mapService.createRandomTestMap();
					_this.map.indexedTiles = _this.mapService.indexTilesByType(_this.map);
					_this.renderingService.initMap(_this);
				});

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