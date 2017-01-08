define(['babylonjs', 'MaterialsService'], function (bjs, MaterialsService) {
	var instance = null;
	// TODO separate factory class form service

	var TerrainTilesService = function (params) {
		var _this = this;

		this.scene = params.scene;

		this.materialsService = MaterialsService.getInstance({
			scene: _this.scene
		});

		this.materials = _this.materialsService.materials;

		this.hexagonSize = params.hexagonSize;
		this.baseTileHeight = 1;

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
	TerrainTilesService.prototype.createMountainTileDecoration = function(){
		var terrainTileDecoration = BABYLON.Mesh.CreateCylinder(
			'mountainTileDecoration',         // name
			this.baseTileHeight,    // height
			0,                      // diameter top
			this.hexagonSize/2,     // diameter bottom
			6,                      // tessellation
			1,                      // subdivisions
			this.scene,             // scene
			false                   // updateable
		);
		terrainTileDecoration.convertToFlatShadedMesh();
		terrainTileDecoration.rotation.y = Math.PI / 2;
		terrainTileDecoration.bakeCurrentTransformIntoVertices();
		terrainTileDecoration.layerMask = 0;
		terrainTileDecoration.isPickable = false;
		return terrainTileDecoration;
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

