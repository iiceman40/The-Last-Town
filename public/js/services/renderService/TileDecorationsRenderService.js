define(['TerrainTilesService', 'MaterialsService', 'babylonjs'], function (TerrainTilesService, MaterialsService, bjs) {
	var instance = null;

	var TileDecorationsRenderService = function () {
		this.babylonViewModel = null;
		this.terrainTilesService = TerrainTilesService.getInstance();
		this.materialsService = MaterialsService.getInstance();
	};

	/**
	 * TODO add map as parameter
	 * TODO iterate over all tile sets in indexed tiles that need decorations (like forest)
	 * TODO iterate over all improvements on the map and draw them (like the main town tile)
	 */
	TileDecorationsRenderService.prototype.renderTileDecorationsForTerrainType = function(terrainType, map, options, babylonViewModel) {
		var _this = this,
			numberOfTreesPerTile = 3,
			SPS = new BABYLON.SolidParticleSystem('SPS', babylonViewModel.scene);

		if(terrainType === 'forest') {
			SPS.addShape(babylonViewModel.models.tree, map.indexedTiles[terrainType].length * numberOfTreesPerTile);
			//babylonViewModel.models.tree.dispose();

			var mesh = SPS.buildMesh();

			SPS.isAlwaysVisible = true;
			mesh.material = _this.materialsService.materials.tree;
			mesh.material.freeze();
			mesh.position = new BABYLON.Vector3(options.startingPosition.x, 0, options.startingPosition.z);
			mesh.freezeWorldMatrix();
			mesh.freezeNormals();

			SPS.initParticles = function () {
				for(var i = 0; i < map.indexedTiles[terrainType].length; i++){
					var tile             = map.indexedTiles[terrainType][i],
						x                = tile.x,
						y                = tile.y,
						offset           = (y%2 === 0) ? options.hexagonSize/2 : 0, // every second row with offset
						yPosition        = -0.7;

					// tree 1
					this.particles[i*numberOfTreesPerTile].position.x = (x * options.hexagonSize + offset) * 0.9 - 0.1;
					this.particles[i*numberOfTreesPerTile].position.z = (y * options.hexagonSize) * 0.8 + 0.1;
					this.particles[i*numberOfTreesPerTile].position.y = yPosition;
					// tree 2
					this.particles[i*numberOfTreesPerTile + 1].position.x = (x * options.hexagonSize + offset) * 0.9;
					this.particles[i*numberOfTreesPerTile + 1].position.z = (y * options.hexagonSize) * 0.8 + 1;
					this.particles[i*numberOfTreesPerTile + 1].position.y = yPosition;
					this.particles[i*numberOfTreesPerTile + 1].scale.y  = 0.8 + 0.2;
					// tree 3
					this.particles[i*numberOfTreesPerTile + 2].position.x = (x * options.hexagonSize + offset) * 0.9 - 1;
					this.particles[i*numberOfTreesPerTile + 2].position.z = (y * options.hexagonSize) * 0.8;
					this.particles[i*numberOfTreesPerTile + 2].position.y = yPosition + 0.1;
					this.particles[i*numberOfTreesPerTile + 2].scale.y  = 0.9;
					this.particles[i*numberOfTreesPerTile + 2].rotation.x = 1.5;
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

			babylonViewModel.mapTilesMeshes.push(mesh);
			babylonViewModel.mapTilesMeshes.push(SPS);

			babylonViewModel.forestSPS = SPS;
			babylonViewModel.forestMesh = mesh;
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