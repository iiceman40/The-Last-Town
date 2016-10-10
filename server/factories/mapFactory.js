'use strict';

var Tile        = require('../models/Tile'),
	PathFinding = require('pathfinding');

var instance = null;

var MapFactory = function(){
	console.log('initializing map factory');
	this.maxMapWith = 100;
	this.maxMapHeight = 100;

	this.terrainRepository = require('../repositories/TerrainRepository').getInstance();
	this.mapCreationService = require('../services/MapCreationService').getInstance();
	this.rngService = require('../services/RngService').getInstance();
};

/**
 *
 * @param settings
 * @returns {{}}
 */
MapFactory.prototype.build = function(settings){
	var _this = this;
	console.log('building new map with settings: ', settings);

	if(settings.width > this.maxMapWith || settings.height > this.maxMapHeight){
		console.log('ERROR - requested map size exceeds the maximum values');
		return null;
	}

	var mapData = {
		title: settings.title,
		width: settings.width,
		height: settings.height,
		townPosition: {
			x: Math.floor(settings.width/2),
			y: Math.floor(settings.height/2)
		},
		seed: settings.seed
	};

	_this.rngService.init(mapData.seed);
	mapData = this.createMapGrid(mapData);

	//mapData = this.connectNeighbors((mapData)); // deactivated because of recursion that will be created

	return mapData;
};

/**
 *
 * @param mapData
 * @returns {*}
 */
MapFactory.prototype.createMapGrid = function (mapData) {
	mapData.tiles = [];
	mapData.matrix = [];
	mapData.enemyMatrix = [];

	mapData = this.mapCreationService.createMap(mapData);

	mapData.indexedTiles = this.indexTilesByType(mapData);
	mapData.id = 'new-Map-random-' + Math.floor(Math.random() * 1000000);

	return mapData;
};

/**
 * index tiles by terrain type after map is completed
 * @param mapData
 */
MapFactory.prototype.indexTilesByType = function(mapData){
	var indexedTiles = {};
	for (var y = 0; y < mapData.height; y++) {
		for (var x = 0; x < mapData.width; x++) {
			var terrainType = mapData.matrix[y][x].terrain;
			if(!indexedTiles.hasOwnProperty(terrainType)) {
				indexedTiles[terrainType] = [];
			}
			indexedTiles[terrainType].push(mapData.matrix[y][x]);
		}
	}
	return indexedTiles;
};


var getInstance = function(){
	if(!instance){
		instance = new MapFactory();
	}
	return instance;
};

exports.getInstance = getInstance;