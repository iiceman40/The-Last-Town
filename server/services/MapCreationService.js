'use strict';

var instance = null;

var MapCreationService = function () {
	var _this = this;

	_this.terrainRepository = require('../repositories/TerrainRepository').getInstance();
	_this.improvementRepository = require('../repositories/ImprovementRepository').getInstance();
	_this.biomeGenerator = require('../factories/BiomeGenerator').getInstance();

	return _this;
};

MapCreationService.prototype.createMap = function(mapData){
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

var getInstance = function(){
	if(!instance){
		instance = new MapCreationService();
	}
	return instance;
};

exports.getInstance = getInstance;