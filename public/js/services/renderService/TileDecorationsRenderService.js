define(['TerrainTilesService', 'babylonjs'], function (TerrainTilesService, bjs) {
	var instance = null;

	var TileDecorationsRenderService = function () {
		this.babylonViewModel = null;
		this.terrainTilesService = TerrainTilesService.getInstance();
	};

	/**
	 * TODO add map as parameter
	 * TODO iterate over all tile sets in indexed tiles that need decorations (like forest)
	 * TODO iterate over all improvements on the map and draw them (like the main town tile)
	 */
	TileDecorationsRenderService.prototype.renderTileDecorations = function(babylonViewModel) {
		var _this = this;
		//_this.models.trees.scaling = new BABYLON.Vector3(0.16, 0.16, 0.16);
		//_this.models.trees.layerMask = 0;
		//_this.models.trees.freezeWorldMatrix();

		/* no difference since trees are probably not complex enough
		 var lowDetailModel = BABYLON.Mesh.CreateCylinder(
		 'lod-tree',             // name
		 11,                     // height
		 0,                      // diameter top
		 7,                      // diameter bottom
		 6,                      // tessellation
		 1,                      // subdivisions
		 scene,                  // scene
		 false                   // updateable
		 );
		 lowDetailModel.position.y = 6;
		 lowDetailModel.bakeCurrentTransformIntoVertices();
		 lowDetailModel.convertToFlatShadedMesh();
		 lowDetailModel.material = _this.models.trees.material.subMaterials[1];
		 _this.models.trees.addLODLevel(70, lowDetailModel);
		 */

		//_this.models.trees.addLODLevel(50, null);

		//_this.babylonViewModel.mapTilesMeshes.push(_this.models.trees);
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