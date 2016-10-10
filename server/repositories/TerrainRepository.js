'use strict';

var instance = null;

/**
 * 
 * @constructor
 */
var TerrainRepository = function () {
	this.rngService = require('../services/RngService').getInstance();

	/**
	 * terrainTypes describes the different tile terrains at the map
	 *
	 * name:
	 * description:
	 * probability: how often displayed at the map
	 * searchTime: how long you have to search until dropping same stuff (seconds)
	 * searchCapacity: resources which are included in the terrain
	 *
	 * @type {{name: string, description: string, probability: number, searchTime: number, searchCapacity: number}[]}
	 */
	this.terrainTypes = {
		none: {},
		dirt: {
			name: 'dirt',
			description: 'Nothing but dirt.',
			probability: 20,
			minSize: 0,
			maxSize: 2,
			searchTime: 5,
			searchCapacity: 0,
			searchResources: []
		},
		grass: {
			name: 'grass',
			description: 'A plane covered with high grass.',
			probability: 15,
			minSize: 1,
			maxSize: 3,
			searchTime: 5,
			searchCapacity: 30,
			searchResources: ['seed', 'wheat']
		},
		forest: {
			name: 'forest',
			description: 'A thick forest with trees everywhere.',
			probability: 35,
			minSize: 0,
			maxSize: 5,
			searchTime: 20,
			searchCapacity: 30,
			searchResources: ['wood', 'apple']
		},
		water: {
			name: 'water',
			description: 'Hmm... water...',
			probability: 2,
			minSize: 1,
			maxSize: 3,
			searchTime: 80,
			searchCapacity: 0,
			searchResources: []
		},
		mud: {
			name: 'mud',
			description: 'Caution mud...',
			probability: 3,
			minSize: 0,
			maxSize: 3,
			searchTime: 160,
			searchCapacity: 15,
			searchResources: ['clay', 'acorus']
		},
		cave: {
			name: 'cave',
			description: 'Huh, an unexplored cave.',
			probability: 5,
			minSize: 0,
			maxSize: 1,
			searchTime: 320,
			searchCapacity: 60,
			searchResources: ['stone', 'metal']
		},
		mountain: {
			name: 'mountain',
			description: 'Insurmountable',
			probability: 5,
			minSize: 0,
			maxSize: 2,
			searchTime: 0,
			searchCapacity: 0,
			searchResources: []
		},
		desert: {
			name: 'desert',
			description: 'Burning hot sand as far as the eye can see.',
			probability: 1,
			minSize: 2,
			maxSize: 4,
			searchTime: 0,
			searchCapacity: 0,
			searchResources: []
		}
	};

	this.terrainTypesByProbability = [];
	this.terrainsByProbability = [];

	// fill terrainTypesByProbability
	for (var i in this.terrainTypes) {
		if(this.terrainTypes.hasOwnProperty(i)) {
			for (var n = 0; n < this.terrainTypes[i].probability; n++) {
				this.terrainTypesByProbability.push(this.terrainTypes[i].name);
				this.terrainsByProbability.push(this.terrainTypes[i]);
			}
		}
	}
};

/*
 * returns string random terrain
 */
TerrainRepository.prototype.createRandom = function (blacklist) {
	blacklist = blacklist || [];

	var _this = this,
		terrain = '';

	do {
		var randomIndex = _this.rngService.randomInt(0, this.terrainsByProbability.length);
		terrain = this.terrainsByProbability[randomIndex]
	} while(blacklist.indexOf(terrain.name) != -1);

	return terrain;
};

/*
 * returns string random terrain type
 */
TerrainRepository.prototype.createRandomType = function (blacklist) {
	var _this = this,
		type = '';

	do {
		var randomIndex = _this.rngService.randomInt(0, this.terrainTypesByProbability.length);
		type = this.terrainTypesByProbability[randomIndex]
	} while(blacklist.indexOf(type) != -1);

	return type;
};

var getInstance = function(){
	if(!instance){
		instance = new TerrainRepository();
	}
	return instance;
};

exports.getInstance = getInstance;