'use strict';

var instance = null;

var MapFactory = function(){
	console.log('initiated map factory');
	this.PF = require('pathfinding');
	this.terrainRepository = require('../repositories/TerrainRepository');
	this.underscore = require('underscore');
};

MapFactory.prototype.getTerrains = function(){
	// TODO get the different terrains from the database
};

MapFactory.prototype.build = function(settings){
	var mapData = {width: 10, height: 10, townPosition: {x: 5, y: 5}}
	mapData = this.createMapGrid(mapData);
	mapData = this.connectNeighbors((mapData));

	// TODO mandatory: height, width, town position
	// TODO optional: seed, limit terrain list, ...
	// TODO us a seed to be able to regenerate a certain random map

	var seedrandom = require('seedrandom');
	var rng = seedrandom('hello.');
	console.log('random with seed (always 0.9282578795792454): ', rng());
	return mapData;
};


MapFactory.prototype.createMapGrid = function (data) {
	data.matrix = [];
	data.enemyMatrix = [];

	var width = data.width;
	var height = data.height;
	var townPosition = data.townPosition;

	var matrix = data.matrix;
	var enemyMatrix = data.enemyMatrix;

	var terrainRepository = this.terrainRepository;
	var PF = this.PF;

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
			var random = Math.floor((Math.random() * 2) + 1);

			var newTerrain;
			if (isMountainProbability < random) {
				newTerrain = 'mountain';
			} else if (townPosition.x == x && townPosition.y == y) {
				newTerrain = 'mainTownTile';
			} else {
				newTerrain = terrainRepository.createRandomType();
			}

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

	data.id = 'new-Map-random-' + Math.floor(Math.random() * 1000000);
	data.townPosition = townPosition;

	return data;
};

/**
 * connects the nodes in a basic map grid to complete it
 * and to make it walkable for players and enemies
 * @param data
 * @returns {*} data (final)
 */
MapFactory.prototype.connectNeighbors = function (data) {
	var height = data.height;
	var width = data.width;

	var matrix = data.matrix;
	var enemyMatrix = data.enemyMatrix;

	// connect neighbours
	for (var y = 0; y < height; y++) {

		for (var x = 0; x < width; x++) {
			var currentNode = matrix[y][x];
			var currentEnemyNode = enemyMatrix[y][x];

			// construct an array of neighbor positions
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

			// iterate over all the neighbors and decide if to add them to the current node or not
			currentNode.visibleNeighbors = [];
			var _ = this.underscore;
			_.each(neighborPositions, function (key, pos) { // FIXME no neighbors added!!!!
				if (pos.y >= 0 && pos.y < height && pos.x >= 0 && pos.x < width) {
					if (currentNode.isWalkable && matrix[pos.y][pos.x].isWalkable) {
						currentNode.neighbors.push(matrix[pos.y][pos.x]);
					}
					currentNode.visibleNeighbors.push(matrix[pos.y][pos.x]);
					if (currentEnemyNode.isWalkable) {
						currentEnemyNode.neighbors.push(enemyMatrix[pos.y][pos.x]);
					}
				}
			});
		}
	}

	return data;
};

var getInstance = function(){
	if(!instance){
		instance = new MapFactory();
	}
	return instance;
};

exports.getInstance = getInstance;