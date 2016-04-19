define(['babylonjs'], function (bjs) {
	var instance = null;

	var RenderService = function () {
		this.models = {};
	};

	RenderService.prototype.initMap = function(map, babylonViewModel){
		var _this = this;
		var scene = babylonViewModel.scene;
		var terrainTiles = babylonViewModel.terrainTiles;

		console.log('rendering map', map, babylonViewModel);

		// TODO use asset manager for textures and models

		var width = map.width;
		var height = map.height;
		var hexagonSize = babylonViewModel.settings.hexagonSize;
		var startPosX = -width * hexagonSize / 2;
		var startPosZ = height * hexagonSize / 2;

		// TODO use asset manager and prepare only one when loading game
		BABYLON.SceneLoader.ImportMesh("trees", "assets/models/trees/", "trees.babylon", scene, function (newMeshes, particleSystems) {
			_this.models.trees = newMeshes[0];
			_this.models.trees.scaling = new BABYLON.Vector3(0.16, 0.16, 0.16);
			_this.models.trees.layerMask = 0;
			_this.models.trees.freezeWorldMatrix();

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

			babylonViewModel.mapTilesMeshes.push(_this.models.trees);

			_this.trees = null;
			for(var y = 0; y < height; y++){
				for(var x = 0; x < width; x++) {
					var terrainTypeIndex = map.matrix[y][x].terrain;
					if(terrainTiles.hasOwnProperty(terrainTypeIndex)) {
						var terrainTileInstance = terrainTiles[terrainTypeIndex].createInstance(terrainTypeIndex + '-' + x + '-' + y);
						var offset = (y%2 === 0) ? hexagonSize/2 : 0; // every second row with offset

						terrainTileInstance.position.x = (startPosX + x * hexagonSize + offset) * 0.9;
						terrainTileInstance.position.z = (startPosZ - y * hexagonSize) * 0.8;

						terrainTileInstance.mapNode = map.matrix[y][x];

						if(terrainTypeIndex === 'forest'){
							_this.createForestTerrainTileDecoration(terrainTileInstance);
						}

					} else {
						console.log('terrain type not found: ', terrainTypeIndex);
					}
				}
			}

			babylonViewModel.octree = scene.createOrUpdateSelectionOctree();
		});
	};

	RenderService.prototype.createForestTerrainTileDecoration = function(terrainTileInstance){
		var treesInstance = this.models.trees.createInstance('trees');
		treesInstance.rotation.y = 0.7 * Math.random() - 0.5;
		treesInstance.position = terrainTileInstance.position.add(new BABYLON.Vector3(0, 0, 0));
		treesInstance.mapNode = terrainTileInstance.mapNode;
		treesInstance.isPickable = false;
		terrainTileInstance.tileDecoration = treesInstance;
	};

	RenderService.prototype.initPlayers = function(players, babylonViewModel){
		// TODO init player avatars
	};

	return {
		getInstance: function () {
			if (!instance) {
				instance = new RenderService();
			}
			return instance;
		}
	};
});
