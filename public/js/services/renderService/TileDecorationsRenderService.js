define([
	'TerrainTilesService', 'MaterialsService', 'DataHelperService', 'babylonjs'
], function (TerrainTilesService, MaterialsService, DataHelperService, bjs) {
	var instance = null;

	var TileDecorationsRenderService = function () {
		this.babylonViewModel = null;
		this.terrainTilesService = TerrainTilesService.getInstance();
		this.materialsService = MaterialsService.getInstance();
		this.dataHelperService = DataHelperService.getInstance();

		this.indexDecorationChunks = {};
	};

	/**
	 * TODO add map as parameter
	 * TODO iterate over all tile sets in indexed tiles that need decorations (like forest)
	 * TODO iterate over all improvements on the map and draw them (like the main town tile)
	 */
	TileDecorationsRenderService.prototype.renderTileDecorationsForTerrainType = function(terrainType, map, options, babylonViewModel) {
		var _this = this,
			tiles = map.indexedTiles[terrainType],
			numberOfTiles = tiles.length,
			chunkSize = 256,
			numberOfChunks = Math.ceil(numberOfTiles / chunkSize);

		if(terrainType === 'forest') {
			var chunks = _this.dataHelperService.chunkify(tiles, numberOfChunks, true);
			console.log({
				numberOfTiles: numberOfTiles,
				numberOfChunks: numberOfChunks,
				chunks: chunks
			});

			for(var i = 0; i < chunks.length; i++) {
				var chunkIndex = 'chunk' + i;
				this.indexDecorationChunks.forest = {};
				this.indexDecorationChunks.forest[chunkIndex] = chunks[i];
				_this.renderTileDecorationsForChunk(chunkIndex, options, babylonViewModel);
			}
		}

	};

	/**
	 * TODO refactor to make function useful in general and not just for forest
	 * @param chunkIndex
	 * @param options
	 * @param babylonViewModel
	 */
	TileDecorationsRenderService.prototype.renderTileDecorationsForChunk = function(chunkIndex, options, babylonViewModel){
		var _this = this,
			tiles = this.indexDecorationChunks.forest[chunkIndex],
			numberOfTiles = tiles.length,
			numberOfDecorationsPerTile = 3, // TODO set this dynamically
			numberOfDecorations = numberOfTiles * numberOfDecorationsPerTile,
			SPS = new BABYLON.SolidParticleSystem('SPS', babylonViewModel.scene);

		SPS.addShape(babylonViewModel.models.tree, numberOfDecorations);

		var mesh = SPS.buildMesh();

		SPS.isAlwaysVisible = true;
		mesh.material = _this.materialsService.materials.tree;
		mesh.material.freeze();
		mesh.position = new BABYLON.Vector3(options.startingPosition.x, 0, options.startingPosition.z);
		mesh.freezeWorldMatrix();
		mesh.freezeNormals();

		SPS.initParticles = function () {
			for(var i = 0; i < tiles.length; i++){
				var tile             = tiles[i],
					x                = tile.x,
					y                = tile.y,
					offset           = (y%2 === 0) ? options.hexagonSize/2 : 0, // every second row with offset
					yPosition        = -0.7;

				tile.decorationChunkIndex = chunkIndex;

				// tree 1
				this.particles[i*numberOfDecorationsPerTile].position.x = (x * options.hexagonSize + offset) * 0.9 - 0.1;
				this.particles[i*numberOfDecorationsPerTile].position.z = (y * options.hexagonSize) * 0.8 + 0.1;
				this.particles[i*numberOfDecorationsPerTile].position.y = yPosition;
				// tree 2
				this.particles[i*numberOfDecorationsPerTile + 1].position.x = (x * options.hexagonSize + offset) * 0.9;
				this.particles[i*numberOfDecorationsPerTile + 1].position.z = (y * options.hexagonSize) * 0.8 + 1;
				this.particles[i*numberOfDecorationsPerTile + 1].position.y = yPosition;
				this.particles[i*numberOfDecorationsPerTile + 1].scale.y  = 0.8 + 0.2;
				// tree 3
				this.particles[i*numberOfDecorationsPerTile + 2].position.x = (x * options.hexagonSize + offset) * 0.9 - 1;
				this.particles[i*numberOfDecorationsPerTile + 2].position.z = (y * options.hexagonSize) * 0.8;
				this.particles[i*numberOfDecorationsPerTile + 2].position.y = yPosition + 0.1;
				this.particles[i*numberOfDecorationsPerTile + 2].scale.y  = 0.9;
				this.particles[i*numberOfDecorationsPerTile + 2].rotation.x = 1.5;
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

		// TODO find better solution to keep track of meshes and SPSs
		babylonViewModel.mapTilesMeshes.push(mesh);
		babylonViewModel.mapTilesMeshes.push(SPS);
		babylonViewModel.forestSPS = SPS;
		babylonViewModel.forestMesh = mesh;
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