'use strict';

var instance = null;

var MapFactory = function(){
	console.log('initiated map factory');
	this.PF = require('pathfinding');
	this.terrainRepository = require('../repositories/TerrainRepository');
};

MapFactory.prototype.getTerrains = function(){
	// TODO get the different terrains from the database
};

MapFactory.prototype.build = function(settings){
	var mapData = this.createMap({width: 10, height: 10, townPosition: {x: 5, y: 5}});
	// TODO mandatory: height, width, town position
	// TODO optional: seed, limit terrain list, ...
	// TODO us a seed to be able to regenerate a certain random map

	var seedrandom = require('seedrandom');
	var rng = seedrandom('hello.');
	console.log('random with seed (always 0.9282578795792454): ', rng());
	return mapData;
};


MapFactory.prototype.createMap = function (data) {
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

			var node = new PF.Node(x, y, 0);
			node.isWalkable = (newTerrain != 'water' && newTerrain != 'mountain');
			node.terrain = newTerrain;
			node.enemies = [];
			currentMapRow.push(node);

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

var getInstance = function(){
	if(!instance){
		instance = new MapFactory();
	}
	return instance;
};

exports.getInstance = getInstance;