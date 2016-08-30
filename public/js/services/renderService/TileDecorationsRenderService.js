define([
	'TerrainTilesService', 'TilesRenderService', 'MaterialsService', 'DataHelperService', 'babylonjs'
], function (
	TerrainTilesService, TilesRenderService, MaterialsService, DataHelperService, bjs
) {
	var instance = null;

	var TileDecorationsRenderService = function () {
		this.babylonViewModel = null;
		this.terrainTilesService = TerrainTilesService.getInstance();
		this.materialsService = MaterialsService.getInstance();
		this.dataHelperService = DataHelperService.getInstance();

		this.solidParticleSystemsByMeshName = {};
	};

	/**
	 *
	 * @param {Object} parameters
	 */
	TileDecorationsRenderService.prototype.initForestDecorationParticle = function(parameters){
		var tiles = parameters.tiles,
			numberOfDecorationsPerTile = parameters.numberOfDecorationsPerTile,
			options = parameters.options,
			chunkIndex = parameters.chunkIndex;

		return function() {
			for (var i = 0; i < tiles.length; i++) {
				var tile = tiles[i],
					x = tile.x,
					y = tile.y,
					offset = (y % 2 === 0) ? options.hexagonSize / 2 : 0, // every second row with offset
					yPosition = -0.7;

				tile.decorationChunkIndex = chunkIndex;
				console.log(i * numberOfDecorationsPerTile);
				if (numberOfDecorationsPerTile > 0) {
					this.particles[i * numberOfDecorationsPerTile].position.x = (x * options.hexagonSize + offset) * 0.9 - 0.1;
					this.particles[i * numberOfDecorationsPerTile].position.z = (y * options.hexagonSize) * 0.8 + 0.1;
					this.particles[i * numberOfDecorationsPerTile].position.y = yPosition;
				}

				if (numberOfDecorationsPerTile > 1) {
					this.particles[i * numberOfDecorationsPerTile + 1].position.x = (x * options.hexagonSize + offset) * 0.9;
					this.particles[i * numberOfDecorationsPerTile + 1].position.z = (y * options.hexagonSize) * 0.8 + 1;
					this.particles[i * numberOfDecorationsPerTile + 1].position.y = yPosition;
					this.particles[i * numberOfDecorationsPerTile + 1].scale.y = 0.8 + 0.2;
				}

				if (numberOfDecorationsPerTile > 2) {
					this.particles[i * numberOfDecorationsPerTile + 2].position.x = (x * options.hexagonSize + offset) * 0.9 - 1;
					this.particles[i * numberOfDecorationsPerTile + 2].position.z = (y * options.hexagonSize) * 0.8;
					this.particles[i * numberOfDecorationsPerTile + 2].position.y = yPosition + 0.1;
					this.particles[i * numberOfDecorationsPerTile + 2].scale.y = 0.9;
					this.particles[i * numberOfDecorationsPerTile + 2].rotation.x = 1.5;
				}
			}
		}
	};

	/**
	 *
	 * @param {Object} parameters
	 */
	TileDecorationsRenderService.prototype.initMountainDecorationParticle = function (parameters) {
		var tiles = parameters.tiles,
			numberOfDecorationsPerTile = parameters.numberOfDecorationsPerTile,
			options = parameters.options,
			chunkIndex = parameters.chunkIndex;

		return function() {
			for (var i = 0; i < tiles.length; i++) {
				var tile = tiles[i],
					x = tile.x,
					y = tile.y,
					offset = (y % 2 === 0) ? options.hexagonSize / 2 : 0; // every second row with offset

				tile.decorationChunkIndex = chunkIndex;

				if (numberOfDecorationsPerTile > 0) {
					this.particles[i].position.x = (x * options.hexagonSize + offset) * 0.9;
					this.particles[i].position.z = (y * options.hexagonSize) * 0.8;
					this.particles[i].position.y = 3 * 0.835;
					this.particles[i].scale.x = 0.68;
					this.particles[i].scale.z = 0.68;
				}
			}
		}
	};

	/**
	 * @param terrainType
	 * @param chunkIndex
	 * @param indexedChunks
	 * @param babylonViewModel
	 * @param options
	 */
	TileDecorationsRenderService.prototype.buildDecorationSpsForChunk = function(terrainType, chunkIndex, indexedChunks, babylonViewModel, options){

		var _this = this,
			tiles = indexedChunks[terrainType][chunkIndex],
			numberOfTiles = tiles.length,
			numberOfDecorationsPerTile = 3,
			numberOfDecorations = numberOfTiles * numberOfDecorationsPerTile,
			meshName = 'SPS_' + terrainType + '_' + chunkIndex + '_decorations',
			SPS = new BABYLON.SolidParticleSystem(meshName, babylonViewModel.scene),
			hasDecoration = true;

		switch(terrainType){
			case 'forest':
				SPS.addShape(babylonViewModel.models.tree, numberOfDecorations);
				SPS.initParticles = _this.initForestDecorationParticle({
					tiles: tiles,
					numberOfDecorationsPerTile: numberOfDecorationsPerTile,
					options: options,
					chunkIndex: chunkIndex
				});
				break;
			case 'mountain':
				numberOfDecorationsPerTile = 1;
				numberOfDecorations = numberOfTiles * numberOfDecorationsPerTile;
				SPS.addShape(_this.terrainTilesService.createMountainTileDecoration(), numberOfDecorations);
				SPS.initParticles = _this.initMountainDecorationParticle({
					tiles: tiles,
					numberOfDecorationsPerTile: numberOfDecorationsPerTile,
					options: options,
					chunkIndex: chunkIndex
				});
				break;
			default:
				hasDecoration = false;
		}

		if(hasDecoration) {

			var mesh = SPS.buildMesh();

			SPS.isAlwaysVisible = true;

			switch(terrainType){
				case 'forest':
					mesh.material = _this.materialsService.materials.tree;
					break;
				case 'mountain':
					mesh.material = _this.materialsService.materials.snow;
					break;
				default:
					hasDecoration = false;
			}

			mesh.material.freeze();
			mesh.position = new BABYLON.Vector3(options.startingPosition.x, 0, options.startingPosition.z);
			mesh.freezeWorldMatrix();
			mesh.freezeNormals();

			// first call to setParticles() settings
			SPS.initParticles();
			SPS.billboard = false;
			SPS.computeParticleTexture = false;
			SPS.computeParticleRotation = false;
			SPS.computeBoundingBox = true;
			SPS.setParticles();

			// settings for next calls
			SPS.computeBoundingBox = false;

			babylonViewModel.mapTilesMeshes.push(mesh);
			babylonViewModel.mapTilesMeshes.push(SPS);
			_this.solidParticleSystemsByMeshName[meshName] = SPS;
		}
	};

	TileDecorationsRenderService.prototype.handleImprovementDecorations = function(terrainTypeIndex, terrainTileInstance){
		if(terrainTypeIndex === 'mainTownTile'){
			this.createTownhallDecoration(terrainTileInstance);
		}
	};

	TileDecorationsRenderService.prototype.createForestTerrainTileDecoration = function(terrainTileInstance){
		var treesInstance = this.models.trees.createInstance('trees');
		treesInstance.rotation.y = 0.7 * Math.random() - 0.5;
		treesInstance.position = terrainTileInstance.position.add(new BABYLON.Vector3(0, 0, 0));
		treesInstance.mapNode = terrainTileInstance.mapNode;
		treesInstance.isPickable = false;
		terrainTileInstance.tileDecoration = treesInstance;
	};

	TileDecorationsRenderService.prototype.createTownhallDecoration = function(terrainTileInstance){
		var townhallInstance = this.models.townhall.createInstance('trees');
		townhallInstance.rotation.y = 0.7 * Math.random() - 0.5;
		townhallInstance.position = terrainTileInstance.position.add(new BABYLON.Vector3(0, 0, 0));
		townhallInstance.mapNode = terrainTileInstance.mapNode;
		townhallInstance.isPickable = false;
		terrainTileInstance.tileDecoration = townhallInstance;
	};

	return {
		getInstance: function () {
			if (!instance) {
				instance = new TileDecorationsRenderService();
			}
			return instance;
		}
	};
});