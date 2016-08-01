'use strict';

var Tile = require('../models/Tile');
var PF = require('pathfinding');

var instance = null;

var MapFactory = function(){
	console.log('initiated map factory');
	this.maxMapWith = 120;
	this.maxMapHeight = 90;

	this.seedrandom = require('seedrandom');
	this.rng = this.seedrandom();

	this.terrainRepository = require('../repositories/TerrainRepository').getInstance();
	this.mapCreationService = require('../services/MapCreationService').getInstance(this.rng);
};

/**
 *
 * @param settings
 * @returns {{}}
 */
MapFactory.prototype.build = function(settings){
	console.log('building new map with settings: ', settings);
	
	if(settings.width > this.maxMapWith || settings.height > this.maxMapHeight){
		console.log('ERROR - requested map size ist bigger than the max values');
		return null;
	}
	
	var mapData = {
		width: settings.width,
		height: settings.height,
		townPosition: {
			x: Math.floor(settings.width/2),
			y: Math.floor(settings.height/2)
		},
		seed: settings.seed
	};

	this.rng = this.seedrandom(mapData.seed);

	//mapData = this.createMapGrid(mapData);
	mapData = this.createMapGridByBioms(mapData);

	//mapData = this.connectNeighbors((mapData)); // deactivated because of recursion that will be created

	return mapData;
};

/**
 * 
 * @param mapData
 * @returns {*}
 */
MapFactory.prototype.createMapGrid = function (mapData) {
	mapData.tiles = [];
	mapData.matrix = [];
	mapData.enemyMatrix = [];
	mapData.indexedTiles = {};

	var width = mapData.width;
	var height = mapData.height;
	var townPosition = mapData.townPosition;

	var matrix = mapData.matrix;
	var enemyMatrix = mapData.enemyMatrix;

	for (var y = 0; y < height; y++) {
		var currentMapRow = [];
		var currentEnemyMapRow = [];

		for (var x = 0; x < width; x++) {

			// place mountains near border
			var distanceToBorderTop = y;
			var distanceToBorderBottom = height - 1 - y;
			var distanceToBorderLeft = x;
			var distanceToBorderRight = width - 1 - x;
			var isMountainProbability = Math.min(distanceToBorderTop, distanceToBorderBottom, distanceToBorderLeft, distanceToBorderRight);
			
			var random = Math.floor((this.rng() * 2) + 1);

			var newTerrainType = 'mountain';
			if (random < isMountainProbability) {
				newTerrainType = this.terrainRepository.createRandomType(this.rng, []);
			}

			// TODO no terrain type for main town tile but an initial fixed improvement?
			if (townPosition.x == x && townPosition.y == y) {
				newTerrainType = 'mainTownTile';
			}

			// tile
			var newTile = new Tile({
				position: {x: x, y: y},
				terrain: newTerrainType
			});
			mapData.tiles.push(newTile);

			// node for player
			var node = new PF.Node(x, y, 0);
			node.isWalkable = (newTerrainType != 'water' && newTerrainType != 'mountain');
			node.terrain = newTerrainType;
			node.enemies = [];
			currentMapRow.push(node);

			// node for enemies
			var enemyNode = new PF.Node(x, y, 0);
			enemyNode.isWalkable = (newTerrainType != 'water');
			currentEnemyMapRow.push(enemyNode);

		}
		matrix.push(currentMapRow);
		enemyMatrix.push(currentEnemyMapRow);

	}

	mapData.indexedTiles = mapData.indexedTiles = this.indexTilesByType();

	mapData.id = 'new-Map-random-' + Math.floor(Math.random() * 1000000);
	mapData.townPosition = townPosition;

	return mapData;
};

MapFactory.prototype.createMapGridByBioms = function (mapData) {
	mapData.tiles = [];
	mapData.matrix = [];
	mapData.enemyMatrix = [];

	mapData = this.mapCreationService.createMap(mapData);

	mapData.indexedTiles = this.indexTilesByType(mapData);

	mapData.id = 'new-Map-random-' + Math.floor(Math.random() * 1000000);

	return mapData;
};

/**
 * index tiles by terrain type after map is completed
 * @param mapData
 */
MapFactory.prototype.indexTilesByType = function(mapData){
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


var getInstance = function(){
	if(!instance){
		instance = new MapFactory();
	}
	return instance;
};

exports.getInstance = getInstance;