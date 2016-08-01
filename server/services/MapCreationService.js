'use strict';

var Tile = require('../models/Tile');
var PF = require('pathfinding');

var instance = null;

var MapCreationService = function (rng) {
	var _this = this;

	_this.terrainRepository = require('../repositories/TerrainRepository').getInstance();
	_this.improvementRepository = require('../repositories/ImprovementRepository').getInstance();
	_this.biomeGenerator = require('../factories/BiomeGenerator').getInstance(rng);

	return _this;
};

MapCreationService.prototype.createMap = function(mapData, rng){
	var self = this,
		settings = {
			randomizeEdge: true,
			terrainType: self.biomeGenerator.terrainTypes[0],
			size: 12,
			centerPosition: {
				x: 10,
				y: 10
			}
		};

	mapData.matrix = {};

	self.biomeGenerator.fillMap(mapData, settings);

	return mapData;
};

var getInstance = function(rng){
	if(!instance){
		instance = new MapCreationService(rng);
	}
	return instance;
};

exports.getInstance = getInstance;