define(['TerrainTilesService', 'babylonjs'], function (TerrainTilesService, bjs) {
	var instance = null;

	var TilesRenderService = function () {
		this.babylonViewModel = null;
		this.scene = null;
		this.terrainTilesService = TerrainTilesService.getInstance();
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

		var startPosition = {
			x: -map.width * babylonViewModel.settings.hexagonSize / 2,
			z: -map.height * babylonViewModel.settings.hexagonSize / 2
		};

		var options = {
			map: map,
			hexagonSize: _this.babylonViewModel.settings.hexagonSize,
			baseTerrainTile: _this.terrainTilesService.createBaseTile(),
			mountainTerrainTile: _this.terrainTilesService.createMountainTile(),
			startingPosition: startPosition
		};

		this.buildSpsForAllTerrainTypes(map, options);

		options.baseTerrainTile.dispose();  // free memory
		options.mountainTerrainTile.dispose();  // free memory

	};

	/**
	 * @param map
	 * @param options
	 */
	TilesRenderService.prototype.buildSpsForAllTerrainTypes = function(map, options){
		var _this = this;

		for(terrainType in map.indexedTiles) {
			if (map.indexedTiles.hasOwnProperty(terrainType)) {
				console.log(terrainType, map.indexedTiles[terrainType].length);
				_this.buildSpsForTerrainType(terrainType, map, options);
			}
		}

	};

	/**
	 * @param terrainType
	 * @param map
	 * @param options
	 */
	TilesRenderService.prototype.buildSpsForTerrainType = function(terrainType, map, options){
		var _this = this;

		var SPS = new BABYLON.SolidParticleSystem('SPS', _this.scene);
		if(terrainType === 'mountain'){
			SPS.addShape(options.mountainTerrainTile, map.indexedTiles[terrainType].length);
		} else {
			SPS.addShape(options.baseTerrainTile, map.indexedTiles[terrainType].length);
		}

		var mesh = SPS.buildMesh();

		SPS.isAlwaysVisible = true;
		//mesh.material = mat; // TODO use material according to terrainType
		//mat.freeze();
		mesh.position = new BABYLON.Vector3(options.startingPosition.x, 0, options.startingPosition.z);
		mesh.freezeWorldMatrix();
		mesh.freezeNormals();

		SPS.initParticles = function () {
			for(var i = 0; i < map.indexedTiles[terrainType].length; i++){
				var tile             = map.indexedTiles[terrainType][i],
					x                = tile.x,
					y                = tile.y,
					offset           = (y%2 === 0) ? options.hexagonSize/2 : 0, // every second row with offset
					tileHeight       = _this.terrainTilesService.baseTileHeight * 0.1,
					color            = new BABYLON.Color3(0.25, 0.35, 0.15);

				switch(terrainType){
					case 'mountain':
						tileHeight = 3;
						color = new BABYLON.Color3(0.2, 0.2, 0.2);
						break;
					case 'cave':
						color = new BABYLON.Color3(0.4, 0.4, 0.4);
						break;
					case 'mud':
						color = new BABYLON.Color3(0.55, 0.31, 0.15);
						break;
					case 'dirt':
						color = new BABYLON.Color3(0.7, 0.5, 0.35);
						break;
					case 'lake':
					case 'water':
						color = new BABYLON.Color3(0.18, 0.18, 0.42);
						break;
					case 'forest':
					case 'grass':
						break;
				}

				this.particles[i].position.x = (x * options.hexagonSize + offset) * 0.9;
				this.particles[i].position.z = (y * options.hexagonSize) * 0.8;
				this.particles[i].position.y = tileHeight / 2;
				this.particles[i].scale.y = tileHeight;
				this.particles[i].color = color;
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

		_this.babylonViewModel.mapTilesMeshes.push(mesh);
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