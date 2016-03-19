"use strict";

var MapRepository = function () {
	var self = this;

	// inject a new terrain repository
	this.terrainRepository = new TerrainRepository();

	/**
	 * creates a Map object by setting up a random grid
	 * and connecting its nodes
	 * @param data
	 * @returns {Map}
	 */
	this.createMap = function (data) {

		var updatedData = self.buildMapGrid(data);
		var finalData = self.connectNeighbors(updatedData);

		return new Map(finalData);
	};

	/**
	 * creates a Map object based on the grid data prepared on the server
	 * @param data
	 * @returns {Map}
	 */
	this.createMapFromServerData = function (data) {

		var width = data.width;
		var height = data.height;

		var matrix = data.matrix;
		var enemyMatrix = data.enemyMatrix;

		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {

				var node = matrix[y][x];
				var enemyNode = enemyMatrix[y][x];

				// create tile
				var newTerrain = this.terrainRepository.createTerrain(node.terrain);
				if (townPosition.x == x && townPosition.y == y) {
					newTerrain = this.terrainRepository.createMainTownTile();
				}

				var newTile = new Tile({
					terrain: newTerrain,
					position: {x: x, y: y}
				});

				node.tile = newTile;
				node.terrain = newTerrain;
				node.isWalkable = !newTerrain.blocked();

				enemyNode.tile = newTile;
				enemyNode.isWalkable = !newTerrain.blockedForEnemy();

				// adding enemies to the current tile
				for (var i = 0; i < node.enemies.length; i++) {
					var newEnemy = node.enemies[i];
					newTile.enemies.push(new Enemy((newEnemy)));
				}

			}
		}

		self.connectNeighbors(data);

		return new Map(data);
	};

	/**
	 * creates a basic random map grid based on the given data/parameters
	 * @param data
	 * @returns {*} data (processed)
	 */
	this.buildMapGrid = function (data) {
		data.matrix = [];
		data.enemyMatrix = [];

		var height = data.height;
		var width = data.width;

		var matrix = data.matrix;
		var enemyMatrix = data.enemyMatrix;

		// build grid
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
					newTerrain = this.terrainRepository.createTerrain('mountain');
				} else if (townPosition.x == x && townPosition.y == y) {
					newTerrain = this.terrainRepository.createMainTownTile();
				} else {
					newTerrain = this.terrainRepository.createRandomTerrain();
				}

				var node = new PF.Node(x, y, 0);
				var enemyNode = new PF.Node(x, y, 0);
				var newTile = new Tile({
					terrain: newTerrain,
					position: {x: x, y: y}
				});
				node.tile = newTile;
				node.isWalkable = !newTerrain.blocked();
				currentMapRow.push(node);

				enemyNode.tile = newTile;
				enemyNode.isWalkable = !newTerrain.blockedForEnemy();
				currentEnemyMapRow.push(enemyNode);

			}
			matrix.push(currentMapRow);
			enemyMatrix.push(currentEnemyMapRow);
		}

		return data;
	};

	/**
	 * connects the nodes in a basic map grid to complete it
	 * and to make it walkable for players and enemies
	 * @param data
	 * @returns {*} data (final)
	 */
	this.connectNeighbors = function (data) {
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
				$.each(neighborPositions, function (key, pos) {
					if (pos.y >= 0 && pos.y < height && pos.x >= 0 && pos.x < width) {
						if (currentNode.isWalkable && matrix[pos.y][pos.x].isWalkable) {
							currentNode.neighbors.push(matrix[pos.y][pos.x]);
						}
						currentNode.tile.visibleNeighbors.push(matrix[pos.y][pos.x]);
						if (currentEnemyNode.isWalkable) {
							currentEnemyNode.neighbors.push(enemyMatrix[pos.y][pos.x]);
						}
					}
				});
			}
		}

		return data;
	}
};