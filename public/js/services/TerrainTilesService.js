define(['babylonjs'], function (bjs) {
	var instance = null;
	// TODO separate factory class form service

	var TerrainTilesService = function (params) {

		this.scene = params.scene;
		this.materials = params.materials;
		this.terrainTiles = {};
		this.selectDisc = null;
		this.hoverDisc = null;

		this.hexagonSize = params.hexagonSize;
		this.baseTileHeight = 1;

	};

	TerrainTilesService.prototype.getSelectDisc = function(){
		return this.selectDisc;
	};

	TerrainTilesService.prototype.getHoverDisc = function(){
		return this.hoverDisc;
	};

	TerrainTilesService.prototype.initSelectDisc = function() {
		this.selectDisc = new BABYLON.Mesh.CreateDisc('select', this.hexagonSize/2 * 1.07, 6, this.scene);
		this.selectDisc.rotation.x = Math.PI/2;
		this.selectDisc.rotation.y = Math.PI/2;
		this.selectDisc.material = this.materials.select;
		this.selectDisc.isVisible = false;
		return this.selectDisc;
	};

	TerrainTilesService.prototype.initHoverDisc = function() {
		this.hoverDisc = new BABYLON.Mesh.CreateDisc('hover', this.hexagonSize/2 * 1.07, 6, this.scene);
		this.hoverDisc.rotation.x = Math.PI/2;
		this.hoverDisc.rotation.y = Math.PI/2;
		this.hoverDisc.material = this.materials.hover;
		this.hoverDisc.isVisible = false;
		return this.hoverDisc;
	};

	/**
	 * @returns BABYLON.Mesh
	 */
	TerrainTilesService.prototype.createBaseTile = function(){
		var terrainTile = BABYLON.Mesh.CreateCylinder(
			'baseTile',             // name
			this.baseTileHeight,    // height
			this.hexagonSize,       // diameter top
			this.hexagonSize,       // diameter bottom
			6,                      // tessellation
			1,                      // subdivisions
			this.scene,             // scene
			false                   // updateable
		);
		terrainTile.convertToFlatShadedMesh();
		terrainTile.rotation.y = Math.PI / 2;
		terrainTile.bakeCurrentTransformIntoVertices();
		terrainTile.layerMask = 0;
		terrainTile.isPickable = false;
		return terrainTile;
	};

	/**
	 * @returns BABYLON.Mesh
	 */
	TerrainTilesService.prototype.createWaterTile = function(){
		var terrainTile = BABYLON.Mesh.CreateDisc(
			'waterTile',            // name
			this.hexagonSize/2,     // radius
			6,                      // tessellation
			this.scene,             // scene
			false                   // updateable
		);
		terrainTile.rotation.x = Math.PI / 2;
		terrainTile.rotation.y = Math.PI / 2;
		terrainTile.bakeCurrentTransformIntoVertices();
		terrainTile.layerMask = 0;
		terrainTile.isPickable = false;
		return terrainTile;
	};

	/**
	 * @returns BABYLON.Mesh
	 */
	TerrainTilesService.prototype.createMountainTile = function(){
		var terrainTile = BABYLON.Mesh.CreateCylinder(
			'mountainTile',         // name
			this.baseTileHeight,    // height
			0,                      // diameter top
			this.hexagonSize,       // diameter bottom
			6,                      // tessellation
			1,                      // subdivisions
			this.scene,             // scene
			false                   // updateable
		);
		terrainTile.convertToFlatShadedMesh();
		terrainTile.rotation.y = Math.PI / 2;
		terrainTile.bakeCurrentTransformIntoVertices();
		terrainTile.layerMask = 0;
		terrainTile.isPickable = false;
		return terrainTile;
	};

	/**
	 * @returns BABYLON.Mesh
	 */
	TerrainTilesService.prototype.createCaveTile = function(){
		var terrainTile = BABYLON.Mesh.CreateCylinder(
			'caveTile',             // name
			this.baseTileHeight,    // height
			this.hexagonSize/3*2,   // diameter top
			this.hexagonSize,       // diameter bottom
			6,                      // tessellation
			1,                      // subdivisions
			this.scene,             // scene
			false                   // updateable
		);
		terrainTile.convertToFlatShadedMesh();
		terrainTile.rotation.y = Math.PI / 2;
		terrainTile.bakeCurrentTransformIntoVertices();
		terrainTile.layerMask = 0;
		terrainTile.isPickable = false;
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

