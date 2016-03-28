'use strict';

var instance = null;

var MapFactory = function(){
	console.log('initiated map factory');
	this.PF = require('pathfinding');
	this.terrainRepository = require('../repositories/TerrainRepository').getInstance();
	this.underscore = require('underscore');
};

MapFactory.prototype.getTerrains = function(){
	// TODO get the different terrains from the database
};

MapFactory.prototype.build = function(settings){
	console.log(this.terrainRepository);
	this.terrainRepository.setSeedValueForRNG('1'); // TODO dynamically set seed
	var mapData = {width: 100, height: 100, townPosition: {x: 5, y: 5}};
	mapData = this.createMapGrid(mapData);
	//mapData = this.connectNeighbors((mapData)); // deactivated because of recursion that will be created

	// TODO mandatory: height, width, town position
	// TODO optional: seed, limit terrain list, ...
	// TODO us a seed to be able to regenerate a certain random map

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
				newTerrain = this.terrainRepository.createRandomType();
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

			for(var i = 0; i < neighborPositions.length; i++){
				var neighborPosition = neighborPositions[i];

				// check if neighbor is still within map limits
				if (neighborPosition.y >= 0 &&
					neighborPosition.y < height &&
					neighborPosition.x >= 0 &&
					neighborPosition.x < width
				) {

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
	return data;
};

var getInstance = function(){
	if(!instance){
		instance = new MapFactory();
	}
	return instance;
};

exports.getInstance = getInstance;