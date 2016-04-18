define(['babylonjs'], function (bjs) {
	var instance = null;
	// TODO rename to factory

	var TerrainTilesService = function (params) {

		this.scene = params.scene;
		this.materials = params.materials;
		this.terrainTiles = {};
		this.selectDisc = null;
		this.hoverDisc = null;

		this.hexagonSize = params.hexagonSize;

	};

	TerrainTilesService.prototype.getSelectDisc = function(){
		return this.selectDisc;
	};

	TerrainTilesService.prototype.getHoverDisc = function(){
		return this.hoverDisc;
	};

	TerrainTilesService.prototype.initSelectDisc = function() {
		this.selectDisc = new BABYLON.Mesh.CreateDisc('select', this.hexagonSize/2 * 1.6, 6, this.scene);
		this.selectDisc.rotation.x = Math.PI/2;
		this.selectDisc.rotation.y = Math.PI/2;
		this.selectDisc.material = this.materials.select;
		this.selectDisc.isVisible = false;
		return this.selectDisc;
	};

	TerrainTilesService.prototype.initHoverDisc = function() {
		this.hoverDisc = new BABYLON.Mesh.CreateDisc('hover', this.hexagonSize/2 * 1.11, 6, this.scene);
		this.hoverDisc.rotation.x = Math.PI/2;
		this.hoverDisc.rotation.y = Math.PI/2;
		this.hoverDisc.material = this.materials.hover;
		this.hoverDisc.isVisible = false;
		return this.hoverDisc;
	};

	/**
	 *
	 * @param {Array} terrainTypes
	 * @param {{mapTilesMeshes: Array}} babylonViewModel
	 * @returns {{}}
	 */
	TerrainTilesService.prototype.initTerrainTiles = function (terrainTypes, babylonViewModel) {
		var _this = this;

		for(var i = 0; i < terrainTypes.length; i++) {
			_this.terrainTiles[terrainTypes[i]] = _this.createTerrainTileBlueprint(terrainTypes[i]);
			babylonViewModel.mapTilesMeshes.push(_this.terrainTiles[terrainTypes[i]]);
		}

		return this.terrainTiles;
	};

	/**
	 *
	 * @param {string} terrainType
	 * @returns {BABYLON.Mesh}
	 */
	TerrainTilesService.prototype.createTerrainTileBlueprint = function(terrainType){
		var scene = this.scene;

		var tileHeight = 0.1;
		var diameterTop = this.hexagonSize;
		var diameterBottom = this.hexagonSize;

		if(terrainType == 'mountain'){
			diameterTop = 0;
			tileHeight = 3;
		}

		if(terrainType == 'cave'){
			diameterTop = 2;
			tileHeight = 1;
		}

		if(terrainType == 'water'){
			tileHeight = 0.01;
		}

		var name = 'base-tile-' + terrainType;
		var terrainTile = BABYLON.Mesh.CreateCylinder(
			name,                   // name
			tileHeight,             // height
			diameterTop,            // diameter top
			diameterBottom,         // diameter bottom
			6,                      // tessellation
			1,                      // subdivisions
			scene,                  // scene
			false                   // updateable
		);
		terrainTile.rotation.y = Math.PI/2;
		terrainTile.position.y = tileHeight/2;
		terrainTile.convertToFlatShadedMesh();
		terrainTile.layerMask = 0;

		//terrainTile.addLODLevel(130, null);

		if(this.materials[terrainType] instanceof BABYLON.StandardMaterial) {
			terrainTile.material = this.materials[terrainType];
		}

		terrainTile.freezeWorldMatrix();

		return terrainTile;
	};

	return {
		getInstance: function (params) {
			if (!instance) {
				instance = new TerrainTilesService(params);
			}
			return instance;
		}
	};
});

