'use strict';

var instance = null;

var MapCreationService = function () {
	var _this = this;

	_this.terrainRepository = require('../repositories/TerrainRepository').getInstance();
	_this.improvementRepository = require('../repositories/ImprovementRepository').getInstance();
	_this.biomeGenerator = require('../factories/BiomeFactory').getInstance();
	_this.matrixService = require('../services/MatrixService').getInstance();
	_this.rngService = require('../services/RngService').getInstance();

	return _this;
};

MapCreationService.prototype.createMap = function(mapData){
	var _this = this,
		settings = {
			randomizeEdge: true,
			terrainType: _this.biomeGenerator.terrainTypes[0],
			size: 12,
			centerPosition: {
				x: 10,
				y: 10
			}
		};

	mapData.matrix = {};

	_this.biomeGenerator.fillMap(mapData, settings);
	_this.finalizeMap(mapData);

	return mapData;
};

/**
 *
 * @param mapData
 */
MapCreationService.prototype.finalizeMap = function(mapData){
	var _this = this;

	for (var y = 0; y < mapData.height; y++) {
		if(mapData.matrix[y] === undefined){
			mapData.matrix[y] = {}
		}
		for (var x = 0; x < mapData.width; x++) {
			_this.fillEmptyTiles(mapData, {x: x, y: y});
			_this.createMapBorder(mapData, {x: x, y: y});
			_this.setHeightLevels(mapData, {x: x, y: y});
		}
	}
};

/**
 *
 * @param {{}} mapData
 * @param {{x: number, y: number}} position
 */
MapCreationService.prototype.fillEmptyTiles = function(mapData, position) {
	var _this = this,
		matrix = mapData.matrix,
		x = position.x,
		y = position.y;

	if (!matrix[y][x]) {
		_this.matrixService.initMatrixPosition(matrix, position);
		matrix[y][x].terrain = 'grass';
	}
};

/**
 *
 * @param {{}} mapData
 * @param {{x: number, y: number}} position
 */
MapCreationService.prototype.createMapBorder = function(mapData, position) {
	var _this  = this,
		matrix = mapData.matrix,
		x      = position.x,
		y      = position.y;

	var distanceToBorderTop = y,
		distanceToBorderBottom = mapData.height - 1 - y,
		distanceToBorderLeft = x,
		distanceToBorderRight = mapData.width - 1 - x,
		distanceToClosestBorder = Math.min(distanceToBorderTop, distanceToBorderBottom, distanceToBorderLeft, distanceToBorderRight);

	if (distanceToClosestBorder <= _this.rngService.randomInt(Math.floor(mapData.width * 0.06), Math.floor(mapData.width * 0.08))) {
		matrix[y][x].terrain  = 'desert';
	}

	if (distanceToClosestBorder <= _this.rngService.randomInt(Math.floor(mapData.width * 0.03), Math.floor(mapData.width * 0.05))) {
		matrix[y][x].terrain  = 'water';
	}
};

/**
 *
 * @param mapData
 * @param {{x: number, y: number}} position
 */
MapCreationService.prototype.setHeightLevels = function(mapData, position) {
	var _this                  = this,
		x                      = position.x,
		y                      = position.y,
		tile                   = mapData.matrix[y][x];

	// TODO implement altitude generation for borders and randomly for areas like the biome factory does

	// TODO all tiles in a lake have to have the same altitude
	if(tile.terrain === 'water' || tile.terrain === 'desert') {
		tile.altitude = 0;
	} else {
		tile.altitude = _this.rngService.randomInt(0, 10);
	}

	// TODO raise some tiles randomly
};

var getInstance = function(){
	if(!instance){
		instance = new MapCreationService();
	}
	return instance;
};

exports.getInstance = getInstance;