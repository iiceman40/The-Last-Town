define(['babylonjs'], function (bjs) {
	var instance = null;

	var MapService = function (params) {

		// this.scene = params.scene;
		// this.materials = params.materials;
		// this.selectMarker = null;
		// this.hoverMarker = null;
		//
		// this.hexagonSize = params.hexagonSize;
		// this.baseTileHeight = 1;

	};

	/**
	 * index tiles by terrain type after map is completed
	 * @param mapData
	 */
	MapService.prototype.indexTilesByType = function(mapData){
		var indexedTiles = {};
		for (var y = 0; y < mapData.height; y++) {
			for (var x = 0; x < mapData.width; x++) {
				var terrainType = mapData.matrix[y][x].terrain;
				if(!indexedTiles.hasOwnProperty(terrainType)) {
					indexedTiles[terrainType] = [];
				}
				indexedTiles[terrainType].push(mapData.matrix[y][x]);
			}
		}
		return indexedTiles;
	};

	/**
	 *
	 */
	MapService.prototype.createRandomTestMap = function() {

		// TODO move to separate function that gets called on first time change of _this.terrainTypes/Tiles
		// init background map for menu
		// TODO get placeholder terrain types from server or terrain types

		var placeholderTerrainTypes = [
			'grass', 'grass', 'grass', 'grass',
			'forest', 'forest', 'forest', 'forest', 'forest', 'forest', 'forest', 'forest','forest',
			'mountain', 'mountain', 'mountain',
			'cave', 'cave', 'cave',
			'dirt', 'dirt', 'dirt', 'dirt', 'dirt',
			'mud', 'mud',
			'water'];

		var mapData = {};

		mapData.width = 10;
		mapData.height = 10;
		mapData.matrix = [];

		for(var y = 0; y < mapData.height; y++){
			mapData.matrix[y] = [];
			for(var x = 0; x < mapData.width; x++) {
				var newTerrainType = placeholderTerrainTypes[Math.floor(Math.random() * placeholderTerrainTypes.length)];
				mapData.matrix[y][x] = {};
				mapData.matrix[y][x].terrain = newTerrainType;
				mapData.matrix[y][x].x = x;
				mapData.matrix[y][x].y = y;
				mapData.matrix[y][x].altitude = (newTerrainType === 'water') ? 0 : Math.floor(Math.random() * 10);
			}
		}
		return mapData;
	};

	return {
		getInstance: function (params) {
			if (!instance) {
				instance = new MapService(params);
			}
			return instance;
		}
	};
});

