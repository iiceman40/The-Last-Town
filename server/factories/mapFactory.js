'use strict';

var Tile = require('../models/Tile');
var PF = require('pathfinding');

var instance = null;

var MapFactory = function(){
	console.log('initiated map factory');
	this.maxMapWith = 80;
	this.maxMapHeight = 60;

	this.terrainRepository = require('../repositories/TerrainRepository').getInstance();
	this.seedrandom = require('seedrandom');
	this.rng = this.seedrandom();
};

/**
 *
 * @param settings
 * @returns {{}}
 */
MapFactory.prototype.build = function(settings){
	console.log('building new map with settings: ', settings);
	
	if(settings.width > this.maxMapWith || settings.height > this.maxMapWith){
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
	mapData = this.createMapGrid(mapData);

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

			var newTerrain = 'mountain';
			if (random < isMountainProbability) {
				newTerrain = this.terrainRepository.createRandomType(this.rng, ['lake']);
			}

			// TODO no terrain type for main town tile but an initial fixed improvement?
			if (townPosition.x == x && townPosition.y == y) {
				newTerrain = 'mainTownTile';
			}

			// tile
			mapData.tiles.push(new Tile({
				position: {x: x, y: y},
				terrain: newTerrain
			}));

			// node for player
			var node = new PF.Node(x, y, 0);
			node.isWalkable = (newTerrain != 'water' && newTerrain != 'mountain');
			node.terrain = newTerrain;
			node.enemies = [];
			currentMapRow.push(node);

			// node for enemies
			var enemyNode = new PF.Node(x, y, 0);
			enemyNode.isWalkable = (newTerrain != 'water');
			currentEnemyMapRow.push(enemyNode);

		}
		matrix.push(currentMapRow);
		enemyMatrix.push(currentEnemyMapRow);

	}
	// TODO maybe use a "LakeFactory"... maybe a general biom factory?
	this.placeLakes(mapData, {
		lakeSize: 20,
		numberOfLakes: 5
	});

	mapData.id = 'new-Map-random-' + Math.floor(Math.random() * 1000000);
	mapData.townPosition = townPosition;

	return mapData;
};

/**
 *
 * @param mapData
 * @param settings
 * @returns {{}}
 */
MapFactory.prototype.placeLakes = function(mapData, settings){
	var numberOfLakes = settings.numberOfLakes || 3;

	for(var i = 0; i < numberOfLakes; i++){
		this.createLake(mapData, settings)
	}
	return mapData
};

MapFactory.prototype.createLake = function(mapData, settings){
	var lakeSize = settings.lakeSize || 20;

	var lakeCenterPosition = {
		x: Math.floor(this.rng() * mapData.width),
		y: Math.floor(this.rng() * mapData.height)
	};
	var lakeCenterNode = mapData.matrix[lakeCenterPosition.y][lakeCenterPosition.x];
	lakeCenterNode.terrain = 'water';
	lakeSize--;

	settings.randomizeEdge = true;

	// TODO use size and iterate multiple times
	var neighborPositions = this.transformNeighborsToTargetType(mapData, lakeCenterNode, settings);
	lakeSize -= neighborPositions.length;

	while (lakeSize > 0) {
		var newNeighborPositions = [];
		for (var i = 0; i < neighborPositions.length; i++) {
			newNeighborPositions = this.transformNeighborsToTargetType(mapData, neighborPositions[i], settings);
			lakeSize -= newNeighborPositions.length;
		}
		neighborPositions.push(newNeighborPositions);
	}
};

/**
 * finds all neighbors of a position and transforms them into the target terrain type
 * @param mapData
 * @param originPosition
 * @param settings
 * @returns {[{x: Number, y: Number}]}
 */
MapFactory.prototype.transformNeighborsToTargetType = function(mapData, originPosition, settings){
	var targetType = 'water';
	var neighborPositions = this.getTileNeighborPositions(originPosition);
	var indicesToUnset = [];

	for(var i = 0; i < neighborPositions.length; i++) {
		var neighborPosition = neighborPositions[i];
		if(settings.randomizeEdge && this.rng() > 0.7){
			indicesToUnset.push(i);
		} else {
			// check if neighbor is still within map limits
			if (this.tileIsInMapBoundaries(neighborPosition, mapData)) {
				mapData.matrix[neighborPosition.y][neighborPosition.x].terrain = targetType;
			}
		}
	}

	for(var j = 0; j < indicesToUnset.length; j++) {
		neighborPositions.splice(indicesToUnset[j],1);
	}

	return neighborPositions;
};

/**
 * connects the nodes in a basic map grid to complete it
 * and to make it walkable for players and enemies
 * @param mapData
 * @returns {*} data (final)
 */
MapFactory.prototype.connectNeighbors = function (mapData) {
	var height = mapData.height;
	var width = mapData.width;

	var matrix = mapData.matrix;
	var enemyMatrix = mapData.enemyMatrix;

	// connect neighbours
	for (var y = 0; y < height; y++) {
		for (var x = 0; x < width; x++) {
			var currentNode = matrix[y][x];
			var currentEnemyNode = enemyMatrix[y][x];

			// construct an array of neighbor positions
			var neighborPositions = this.getTileNeighborPositions({x: x, y: y});

			// iterate over all the neighbors and decide if to add them to the current node or not
			currentNode.visibleNeighbors = [];

			for(var i = 0; i < neighborPositions.length; i++){
				var neighborPosition = neighborPositions[i];

				// check if neighbor is still within map limits
				if (this.tileIsInMapBoundaries(neighborPosition, mapData)) {

					var neighborNode = matrix[neighborPosition.y][neighborPosition.x];
					var neighborNodePosition = {x: neighborPosition.x, y: neighborPosition.y};

					if (currentNode.isWalkable && neighborNode.isWalkable) {
						//currentNode.neighbors.push(neighborNode);
						currentNode.neighbors.push(neighborNodePosition);
					}
					//currentNode.visibleNeighbors.push(neighborNode);
					currentNode.visibleNeighbors.push(neighborNodePosition);

					if (currentEnemyNode.isWalkable) {
						currentEnemyNode.neighbors.push(neighborNode);
						currentEnemyNode.neighbors.push(neighborNodePosition);
					}

				}

			}
		}
	}

	console.log('returning data');
	return mapData;
};

MapFactory.prototype.getTileNeighborPositions = function(tilePosition){
	var x = tilePosition.x;
	var y = tilePosition.y;
	var neighborPositions = [
		{x: x + 1, y: y}, // right
		{x: x - 1, y: y} // left
	];
	if (y % 2 == 0) {
		// even row
		neighborPositions.push({x: x, y: y - 1}); // top left
		neighborPositions.push({x: x + 1, y: y - 1}); // top right
		neighborPositions.push({x: x, y: y + 1}); // bottom left
		neighborPositions.push({x: x + 1, y: y + 1}); // bottom right
	} else {
		// odd row
		neighborPositions.push({x: x - 1, y: y - 1}); // top left
		neighborPositions.push({x: x, y: y - 1}); // top right
		neighborPositions.push({x: x - 1, y: y + 1}); // bottom left
		neighborPositions.push({x: x, y: y + 1}); // bottom right
	}
	return neighborPositions;
};

MapFactory.prototype.tileIsInMapBoundaries = function(tilePosition, mapData){
	return (
		tilePosition.y >= 0 &&
		tilePosition.y < mapData.height &&
		tilePosition.x >= 0 &&
		tilePosition.x < mapData.width
	)
};

var getInstance = function(){
	if(!instance){
		instance = new MapFactory();
	}
	return instance;
};

exports.getInstance = getInstance;