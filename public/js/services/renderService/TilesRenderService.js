define([
	'TerrainTilesService', 'MaterialsService', 'TileDecorationsRenderService', 'babylonjs', 'underscore'
], function (TerrainTilesService, MaterialsService, TileDecorationsRenderService, bjs, _) {
	var instance = null;

	var TilesRenderService = function () {
		this.babylonViewModel = null;
		this.scene = null;

		this.options = {};
		this.solidParticleSystemsByMeshName = {};

		this.terrainTilesService = TerrainTilesService.getInstance();
		this.materialsService = MaterialsService.getInstance();
		this.tileDecorationsRenderService = TileDecorationsRenderService.getInstance();
	};

	TilesRenderService.prototype.initTileTypes = function(){
		var _this = this;
		console.log('initiating tile types');

		this.options.tileTypes = {
			baseTerrainTile: _this.terrainTilesService.createBaseTile(),
			waterTerrainTile: _this.terrainTilesService.createWaterTile(),
			mountainTerrainTile: _this.terrainTilesService.createMountainTile(),
			caveTerrainTile: _this.terrainTilesService.createCaveTile()
		};

	};

	/**
	 *
	 * @param babylonViewModel
	 */
	TilesRenderService.prototype.renderTiles = function(babylonViewModel) {
		var _this = this,
			map = babylonViewModel.map;

		_this.babylonViewModel = babylonViewModel;
		_this.scene = babylonViewModel.scene;

		if(!this.options.tileTypes) {
			this.initTileTypes();
		}

		var startPosition = {
			x: -map.width * babylonViewModel.settings.hexagonSize / 2,
			z: -map.height * babylonViewModel.settings.hexagonSize / 2
		};

		_.extend(this.options, {
			map: map,
			hexagonSize: _this.babylonViewModel.settings.hexagonSize,
			startingPosition: startPosition
		});

		this.buildSpsForAllTerrainTypes(map);
	};

	/**
	 *
	 * @param map
	 */
	TilesRenderService.prototype.buildSpsForAllTerrainTypes = function(map){
		var _this = this;

		for(terrainType in map.indexedTiles) {
			if (map.indexedTiles.hasOwnProperty(terrainType)) {
				_this.buildSpsForTerrainType(terrainType, map);
				// render tile decorations
				this.tileDecorationsRenderService.renderTileDecorationsForTerrainType(terrainType, map, this.options, _this.babylonViewModel);
			}
		}
	};

	/**
	 * @param terrainType
	 * @param map
	 */
	TilesRenderService.prototype.buildSpsForTerrainType = function(terrainType, map){
		if(terrainType != 'none') {
			var _this = this,
				options = this.options,
				tileHeight = _this.terrainTilesService.baseTileHeight * 0.1,
				meshName = 'SPS_' + terrainType;

			var SPS = new BABYLON.SolidParticleSystem(meshName, _this.scene, {isPickable: true});
			switch (terrainType) {
				case 'mountain':
					SPS.addShape(options.tileTypes.mountainTerrainTile, map.indexedTiles[terrainType].length);
					tileHeight = 3;
					break;
				case 'water':
				case 'lake':
					SPS.addShape(options.tileTypes.waterTerrainTile, map.indexedTiles[terrainType].length);
					tileHeight = 0.1;
					break;
				case 'cave':
					SPS.addShape(options.tileTypes.caveTerrainTile, map.indexedTiles[terrainType].length);
					tileHeight = 1;
					break;
				default:
					SPS.addShape(options.tileTypes.baseTerrainTile, map.indexedTiles[terrainType].length);
			}

			var mesh = SPS.buildMesh();

			SPS.isAlwaysVisible = true;

			// material
			if (_this.materialsService.materials.hasOwnProperty(terrainType)) {
				mesh.material = _this.materialsService.materials[terrainType];
				mesh.material.freeze();
			}

			mesh.position = new BABYLON.Vector3(options.startingPosition.x, 0, options.startingPosition.z);
			//mesh.freezeWorldMatrix();
			mesh.freezeNormals();

			SPS.initParticles = function () {
				for (var i = 0; i < map.indexedTiles[terrainType].length; i++) {
					var tile = map.indexedTiles[terrainType][i],
						x = tile.x,
						y = tile.y,
						offset = (y % 2 === 0) ? options.hexagonSize / 2 : 0; // every second row with offset

					this.particles[i].position.x = (x * options.hexagonSize + offset) * 0.9;
					this.particles[i].position.z = (y * options.hexagonSize) * 0.8;
					this.particles[i].position.y = tileHeight / 2;
					this.particles[i].scale.y = tileHeight;
					this.particles[i].tile = tile;
				}
			};

			// first call to setParticles() settings
			SPS.initParticles();
			SPS.billboard = false;
			SPS.computeParticleTexture = false;
			SPS.computeParticleRotation = false;
			SPS.computeBoundingBox = true;
			SPS.setParticles();

			// settings for next calls
			SPS.computeBoundingBox = false;

			SPS.refreshVisibleSize();

			_this.babylonViewModel.mapTilesMeshes.push(mesh);
			_this.babylonViewModel.mapTilesMeshes.push(SPS);
			_this.solidParticleSystemsByMeshName[meshName] = SPS;
		}
	};

	return {
		getInstance: function () {
			if (!instance) {
				instance = new TilesRenderService();
			}
			return instance;
		}
	};
});