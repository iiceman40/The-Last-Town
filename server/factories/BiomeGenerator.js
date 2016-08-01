"use strict";

var _ = require('underscore');

var instance = null;

/**
 *
 * @constructor
 */
var BiomeGenerator = function (rng) {
	this.terrainRepository = require('../repositories/TerrainRepository').getInstance();
	this.rng = rng || Math.random;
	this.terrainTypes = [];
	this.filledTiles = 0;
};

/**
 *
 * @param mapData
 * @param settings
 */
BiomeGenerator.prototype.fillMap = function(mapData, settings){
	var _this = this;

	while(this.filledTiles < mapData.height * mapData.width * 0.9){
		_this.createRandomComplexBiome(mapData, settings);
	}
	_this.finalizeMap(mapData, settings);
};

/**
 *
 * @param mapData
 */
BiomeGenerator.prototype.finalizeMap = function(mapData){
	var _this = this;

	for (var y = 0; y < mapData.height; y++) {
		if(mapData.matrix[y] === undefined){
			mapData.matrix[y] = {}
		}
		for (var x = 0; x < mapData.width; x++) {
			if(!mapData.matrix[y][x]) {
				_this.initMatrixPosition(mapData.matrix, {x: x, y: y});
				mapData.matrix[y][x].terrain  = 'grass';
			}

			// place mountains near border
			var distanceToBorderTop = y,
				distanceToBorderBottom = mapData.height - 1 - y,
				distanceToBorderLeft = x,
				distanceToBorderRight = mapData.width - 1 - x,
				isMountainThreshold = Math.min(distanceToBorderTop, distanceToBorderBottom, distanceToBorderLeft, distanceToBorderRight);

			if (_this.randomInt(1, 3) > isMountainThreshold) {
				mapData.matrix[y][x].terrain  = 'mountain';
			}
		}
	}
};

/**
 *
 * @param mapData
 * @param settings
 */
BiomeGenerator.prototype.createRandomComplexBiome = function(mapData, settings){
	var _this = this;

	settings.centerPosition = {x: Math.floor(_this.rng() * mapData.width), y: Math.floor(_this.rng() * mapData.height)};

	this.createRandomComplexBiomeAtPosition(mapData, settings);
};

/**
 *
 * @param mapData
 * @param settings
 */
BiomeGenerator.prototype.createRandomComplexBiomeAtPosition = function(mapData, settings){
	var _this = this,
		terrainObject = this.terrainRepository.createRandom();

	settings.size = this.randomInt(terrainObject.minSize, terrainObject.maxSize);
	settings.terrainType = terrainObject.name;

	this.createBiomeFromSettings(mapData, settings);

	_this.appendBiome(mapData, settings);
	_this.appendBiome(mapData, settings);
};

BiomeGenerator.prototype.appendBiome = function(mapData, settings){
	settings = _.extend({}, settings);

	var _this = this,
		offsetX = _this.randomInt(settings.size, settings.size * 2) * (_this.randomInt(1, 2) - 1),
		offsetY = _this.randomInt(settings.size, settings.size * 2) * (_this.randomInt(1, 2) - 1);
	settings.centerPosition = {
		x: settings.centerPosition.x + offsetX,
		y: settings.centerPosition.y + offsetY
	};
	settings.size = settings.size / 3 * 2;
	this.createBiomeFromSettings(mapData, settings);
};

BiomeGenerator.prototype.randomInt = function(min, max){
	min = Math.floor(min);
	max = Math.floor(max);

	var _this = this;

	return min + Math.floor(_this.rng() * (max - min));
};

/**
 *
 * @param mapData
 * @param settings
 */
BiomeGenerator.prototype.createRandomBiome = function (mapData, settings) {
	var _this = this;

	settings.centerPosition = {x: Math.floor(_this.rng() * mapData.width), y: Math.floor(_this.rng() * mapData.height)};

	this.createRandomBiomeAtPosition(mapData, settings);
};

/**
 *
 * @param mapData
 * @param settings
 */
BiomeGenerator.prototype.createRandomBiomeAtPosition = function (mapData, settings) {
	var _this = this,
		terrainObject = this.terrainRepository.createRandom();
	settings.size = this.randomInt(terrainObject.minSize, terrainObject.maxSize);
	settings.terrainType = terrainObject.type;

	this.createBiomeFromSettings(mapData, settings);
};

/**
 *
 * @param mapData
 * @param settings
 */
BiomeGenerator.prototype.createBiomeFromSettings = function (mapData, settings) {
	var transformedNodes = {},
		biomeSize        = settings.size,
		matrix           = mapData.matrix,
		centerPosition   = settings.centerPosition;

	// begin at starting point
	this.initMatrixPosition(matrix, centerPosition);

	if(!mapData.matrix[centerPosition.y][centerPosition.x].terrain) {
		matrix[centerPosition.y][centerPosition.x].terrain = settings.terrainType;
		this.filledTiles++;

		// transform neighbors of starting point
		var nodePositions = [
			centerPosition
		];

		var iteration = 1;
		while (biomeSize > 0) {
			var nextNodePositions = [];
			for (var i = 0; i < nodePositions.length; i++) {
				var node = nodePositions[i];
				node.iteration = iteration;
				var neighborNodes = this.transformNeighborsToTargetType(mapData, node, settings);
				for (var j = 0; j < neighborNodes.length; j++) {
					var neighborNode = neighborNodes[j],
						identifier = neighborNode.x + '-' + neighborNode.y;
					if (!transformedNodes.hasOwnProperty(identifier)) {
						nextNodePositions.push(neighborNode);
					}
					transformedNodes[identifier] = neighborNode;
				}
			}
			nodePositions = nextNodePositions;
			biomeSize--;
			iteration++;
		}
	}
};

/**
 *
 * @param matrix
 * @param position
 */
BiomeGenerator.prototype.initMatrixPosition = function (matrix, position) {
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
 *
 * @param mapData
 * @param position
 * @param settings
 */
BiomeGenerator.prototype.transformNeighborsToTargetType = function (mapData, position, settings) {
	var _this = this,
		targetType = settings.terrainType,
		neighborPositions = this.getTileNeighborPositions(position),
		indicesToUnset = [];

	for (var i = 0; i < neighborPositions.length; i++) {
		var neighborPosition = neighborPositions[i];
		if (settings.randomizeEdge && _this.rng() > 0.7) {
			indicesToUnset.push(i);
		} else {
			// check if neighbor is still within map limits
			if (this.tileIsInMapBoundaries(neighborPosition, mapData)) {
				this.initMatrixPosition(mapData.matrix, neighborPosition);
				if(!mapData.matrix[neighborPosition.y][neighborPosition.x].terrain) {
					mapData.matrix[neighborPosition.y][neighborPosition.x].terrain = targetType;
					this.filledTiles++;
				}
			}
		}
	}

	for (var j = 0; j < indicesToUnset.length; j++) {
		neighborPositions.splice(indicesToUnset[j], 1);
	}

	return neighborPositions;
};

/**
 *
 * @param tilePosition
 * @returns {*[]}
 */
BiomeGenerator.prototype.getTileNeighborPositions = function (tilePosition) {
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

/**
 *
 * @param tilePosition
 * @param mapData
 * @returns {boolean}
 */
BiomeGenerator.prototype.tileIsInMapBoundaries = function (tilePosition, mapData) {
	return (
		tilePosition.y >= 0 &&
		tilePosition.y < mapData.height &&
		tilePosition.x >= 0 &&
		tilePosition.x < mapData.width
	)
};

var getInstance = function(rng){
	if(!instance){
		instance = new BiomeGenerator(rng);
	}
	return instance;
};

exports.getInstance = getInstance;