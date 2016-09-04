"use strict";

var _= require('underscore'),
	instance = null;

/**
 *
 * @constructor
 */
var BiomeFactory = function () {
	this.terrainRepository = require('../repositories/TerrainRepository').getInstance();
	this.matrixService = require('../services/MatrixService').getInstance();
	this.rngService = require('../services/RngService').getInstance();
	this.terrainTypes = [];
	this.filledTiles = 0;
};

/**
 *
 * @param mapData
 * @param settings
 */
BiomeFactory.prototype.fillMap = function(mapData, settings){
	var _this = this;

	_this.filledTiles = 0;

	while(this.filledTiles < mapData.height * mapData.width * 0.9){
		_this.createRandomComplexBiome(mapData, settings);
	}
};

/**
 *
 * @param mapData
 * @param settings
 */
BiomeFactory.prototype.createRandomComplexBiome = function(mapData, settings){
	var _this = this;

	settings.centerPosition = {x: Math.floor(_this.rngService.random() * mapData.width), y: Math.floor(_this.rngService.random() * mapData.height)};

	this.createRandomComplexBiomeAtPosition(mapData, settings);
};

/**
 *
 * @param mapData
 * @param settings
 */
BiomeFactory.prototype.createRandomComplexBiomeAtPosition = function(mapData, settings){
	var _this = this,
		terrainObject = this.terrainRepository.createRandom();

	settings.size = this.rngService.randomInt(terrainObject.minSize, terrainObject.maxSize);
	settings.terrainType = terrainObject.name;

	this.createBiomeFromSettings(mapData, settings);

	_this.appendBiome(mapData, settings);
	_this.appendBiome(mapData, settings);
};

/**
 *
 * @param mapData
 * @param settings
 */
BiomeFactory.prototype.appendBiome = function(mapData, settings){
	settings = _.extend({}, settings);

	var _this = this,
		offsetX = _this.rngService.randomInt(settings.size, settings.size * 2) * (_this.rngService.randomInt(1, 2) - 1),
		offsetY = _this.rngService.randomInt(settings.size, settings.size * 2) * (_this.rngService.randomInt(1, 2) - 1);
	settings.centerPosition = {
		x: settings.centerPosition.x + offsetX,
		y: settings.centerPosition.y + offsetY
	};
	settings.size = settings.size / 3 * 2;
	this.createBiomeFromSettings(mapData, settings);
};

/**
 *
 * @param mapData
 * @param settings
 */
BiomeFactory.prototype.createBiomeFromSettings = function (mapData, settings) {
	var transformedNodes = {},
		biomeSize        = settings.size,
		matrix           = mapData.matrix,
		centerPosition   = settings.centerPosition;

	// begin at starting point
	this.matrixService.initMatrixPosition(matrix, centerPosition);

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
 * @param mapData
 * @param position
 * @param settings
 */
BiomeFactory.prototype.transformNeighborsToTargetType = function (mapData, position, settings) {
	var _this = this,
		targetType = settings.terrainType,
		neighborPositions = this.getTileNeighborPositions(position),
		indicesToUnset = [];

	for (var i = 0; i < neighborPositions.length; i++) {
		var neighborPosition = neighborPositions[i];
		if (settings.randomizeEdge && _this.rngService.random() > 0.7) {
			indicesToUnset.push(i);
		} else {
			// check if neighbor is still within map limits
			if (this.tileIsInMapBoundaries(neighborPosition, mapData)) {
				this.matrixService.initMatrixPosition(mapData.matrix, neighborPosition);
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
BiomeFactory.prototype.getTileNeighborPositions = function (tilePosition) {
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
BiomeFactory.prototype.tileIsInMapBoundaries = function (tilePosition, mapData) {
	return (
		tilePosition.y >= 0 &&
		tilePosition.y < mapData.height &&
		tilePosition.x >= 0 &&
		tilePosition.x < mapData.width
	)
};

var getInstance = function(){
	if(!instance){
		instance = new BiomeFactory();
	}
	return instance;
};

exports.getInstance = getInstance;