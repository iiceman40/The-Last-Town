define(['babylonjs'], function (bjs) {
	var instance = null;

	var RenderService = function () {

	};

	RenderService.prototype.initMap = function(map, babylonViewModel){
		var scene = babylonViewModel.scene;
		var terrainTiles = babylonViewModel.terrainTiles;
		var terrainTypes = babylonViewModel.terrainTypes;

		console.log('rendering map', map, babylonViewModel);

		// TODO use asset manager for textures and models
		// TODO use instances for terrains

		console.log(scene.meshes);

		var width = map.width;
		var height = map.height;
		var hexagonSize = babylonViewModel.settings.hexagonSize;
		var startPosX = -width * hexagonSize / 2;
		var startPosZ = height * hexagonSize / 2;
		for(var y = 0; y < height; y++){
			for(var x = 0; x < width; x++) {
				var terrainTypeIndex = map.matrix[y][x].terrain;
				if(terrainTiles.hasOwnProperty(terrainTypeIndex)) {
					var terrainTileInstance = terrainTiles[terrainTypeIndex].createInstance(terrainTypeIndex + '-' + x + '-' + y);
					var offset = (y%2 === 0) ? hexagonSize/2 : 0; // every second row with offset

					terrainTileInstance.position.x = (startPosX + x * hexagonSize + offset) * 0.9;
					terrainTileInstance.position.z = (startPosZ - y * hexagonSize) * 0.8;

					babylonViewModel.mapTilesMeshes.push(terrainTileInstance);
				} else {
					console.log('terrain type not found: ', terrainTypeIndex);
				}
			}
		}
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
