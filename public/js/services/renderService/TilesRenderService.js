define([
	'TerrainTilesService', 'MaterialsService', 'TileDecorationsRenderService', 'DataHelperService',
	'babylonjs', 'underscore'
], function (TerrainTilesService, MaterialsService, TileDecorationsRenderService, DataHelperService, bjs, _) {
	var instance = null;

	var TilesRenderService = function () {
		this.babylonViewModel = null;
		this.scene = null;

		this.options = {};
		this.solidParticleSystemsByMeshName = {};
		this.indexedChunks = {};
		this.maxChunkSize = 128;

		this.terrainTilesService = TerrainTilesService.getInstance();
		this.materialsService = MaterialsService.getInstance();
		this.tileDecorationsRenderService = TileDecorationsRenderService.getInstance();
		this.dataHelperService = DataHelperService.getInstance();
	};

	TilesRenderService.prototype.initTileTypes = function(){
		var _this = this;
		this.options.tileTypes = {
			baseTerrainTile: _this.terrainTilesService.createBaseTile(),
			waterTerrainTile: _this.terrainTilesService.createWaterTile(),
			mountainTerrainTile: _this.terrainTilesService.createMountainTile(),
			caveTerrainTile: _this.terrainTilesService.createCaveTile()
		};
	};

	/**
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
				tiles = map.indexedTiles[terrainType],
				numberOfTiles = tiles.length,
				chunkSize = _this.maxChunkSize,
				numberOfChunks = Math.ceil(numberOfTiles / chunkSize);

			var chunks = _this.dataHelperService.chunkify(tiles, numberOfChunks, true);

			for(var i = 0; i < chunks.length; i++) {
				var chunkIndex = 'chunk' + i;
				if(!this.indexedChunks.hasOwnProperty(terrainType)){
					this.indexedChunks[terrainType] = {};
				}

				this.indexedChunks[terrainType][chunkIndex] = chunks[i];

				// build chunk
				_this.buildSpsForChunk(terrainType, chunkIndex);

				// build decoration chunk
				_this.tileDecorationsRenderService.buildDecorationSpsForChunk(
					terrainType,
					chunkIndex,
					_this.indexedChunks,
					_this.babylonViewModel,
					_this.options
				);
			}
		}
	};

	/**
	 *
	 * @param terrainType
 * @param chunkIndex
	 */
	TilesRenderService.prototype.buildSpsForChunk = function(terrainType, chunkIndex){
		var _this = this,
			tiles = _this.indexedChunks[terrainType][chunkIndex],
			numberOfTiles = tiles.length,
			options = _this.options,
			tileHeight = _this.terrainTilesService.baseTileHeight * 0.1,
			meshName = 'SPS_' + terrainType + '_' + chunkIndex;

		var SPS = new BABYLON.SolidParticleSystem(meshName, _this.scene, {isPickable: true});
		switch (terrainType) {
			case 'mountain':
				SPS.addShape(options.tileTypes.mountainTerrainTile, numberOfTiles);
				tileHeight = 3;
				break;
			case 'water':
				SPS.addShape(options.tileTypes.waterTerrainTile, numberOfTiles);
				tileHeight = 0.1;
				break;
			case 'cave':
				SPS.addShape(options.tileTypes.caveTerrainTile, numberOfTiles);
				tileHeight = 1;
				break;
			default:
				SPS.addShape(options.tileTypes.baseTerrainTile, numberOfTiles);
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

			for (var i = 0; i < numberOfTiles; i++) {
				var tile = tiles[i],
					x         = tile.x,
					y         = tile.y,
					yPosition = tileHeight / 2 + tile.altitude * 0.05,
					height    = yPosition * 2,
					offset    = (y % 2 === 0) ? options.hexagonSize / 2 : 0; // every second row with offset

				if(tile.terrain === 'mountain') {
					yPosition += tile.altitude * 0.03;
				}

				tile.chunkIndex = chunkIndex;

				this.particles[i].position.x = (x * options.hexagonSize + offset) * 0.9;
				this.particles[i].position.z = (y * options.hexagonSize) * 0.8;
				this.particles[i].position.y = yPosition;
				this.particles[i].scale.y = height;
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