"use strict";

var instance = null;
var PF = require('pathfinding');

var MatrixService = function () {
	this.rng = null;
};

/**
 *
 * @param {Array} matrix
 * @param {{x: number, y: number}} position
 */
MatrixService.prototype.initMatrixPosition = function (matrix, position) {
	var x = position.x,
		y = position.y;

	if (!matrix[y]) {
		matrix[y] = {};
	}
	if (!matrix[y][x]) {
		matrix[y][x] = position;
	}
};

/**
 * creates a basic random map grid based on the given data/parameters
 * @param mapData
 * @returns {*} mapData (processed)
 */
MatrixService.prototype.buildPathFindingMatrices = function (mapData) {
	var matrices = {
			player: [],
			enemy: []
		},
		height = mapData.height,
		width = mapData.width;

	// build path finding matrix for player and enemy
	for (var y = 0; y < height; y++) {
		var currentMapRow = [],
			currentEnemyMapRow = [];

		for (var x = 0; x < width; x++) {

			var node = new PF.Node(x, y, 0),
				enemyNode = new PF.Node(x, y, 0);

			node.isWalkable = true; // TODO get this from actual map grid based on terrain type
			currentMapRow.push(node);

			enemyNode.isWalkable = true; // TODO get this from actual map grid based on terrain type
			currentEnemyMapRow.push(enemyNode);

		}
		matrices.player.push(currentMapRow);
		matrices.enemy.push(currentEnemyMapRow);
	}

	return matrices;
};

/**
 * connects the nodes in a basic map grid to complete it
 * and to make it walkable for players and enemies
 * @param mapData
 * @returns {*} mapData (final)
 */
MatrixService.prototype.connectNeighbors = function (mapData) {
	var height = mapData.height;
	var width = mapData.width;

	var matrix = mapData.matrices.player;
	var enemyMatrix = mapData.matrices.enemy

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
			for (var i = 0; i < neighborPositions.length; i++) {
				var pos = neighborPositions[i];
				if (pos.y >= 0 && pos.y < height && pos.x >= 0 && pos.x < width) {
					if (currentNode.isWalkable && matrix[pos.y][pos.x].isWalkable) {
						currentNode.neighbors.push(matrix[pos.y][pos.x]);
					}
					// currentNode.tile.visibleNeighbors.push(matrix[pos.y][pos.x]);
					// if (currentEnemyNode.isWalkable) {
					// 	currentEnemyNode.neighbors.push(enemyMatrix[pos.y][pos.x]);
					// }
				}
			}
		}
	}

	return mapData;
};

/**
 *
 * @param { {x: {integer}, y: {integer}} } startPos
 * @param { {x: {integer}, y: {integer}} } endPos
 * @param { {matrix: {}} } mapData
 * @returns {Array.<(number|number)[]>}
 */
MatrixService.prototype.calculatePath = function (startPos, endPos, mapData) {
	var _this = this;
	mapData.matrices = _this.buildPathFindingMatrices(mapData);
	mapData = _this.connectNeighbors(mapData);
	// TODO ^-- Dont do that everytime!? keep a grid with neighbors

	var finder = new PF.AStarFinder();

	var startNode = mapData.matrices.player[startPos.y][startPos.x];
	var endNode = mapData.matrices.player[endPos.y][endPos.x];

	var path = finder.findPath(startNode, endNode);

	return path;
};

var getInstance = function () {
	if (!instance) {
		instance = new MatrixService();
	}
	return instance;
};

exports.getInstance = getInstance;