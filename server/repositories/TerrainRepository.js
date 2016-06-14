'use strict';

var instance = null;

/**
 * 
 * @constructor
 */
var TerrainRepository = function () {
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
			searchTime: 5,
			searchCapacity: 0,
			searchResources: []
		},
		grass: {
			name: 'grass',
			description: 'A plane covered with high grass.',
			probability: 20,
			searchTime: 5,
			searchCapacity: 30,
			searchResources: ['seed', 'wheat']
		},
		forest: {
			name: 'forest',
			description: 'A thick forest with trees everywhere.',
			probability: 30,
			searchTime: 20,
			searchCapacity: 30,
			searchResources: ['wood', 'apple']
		},
		water: {
			name: 'water',
			description: 'Hmm... water...',
			probability: 2,
			searchTime: 80,
			searchCapacity: 0,
			searchResources: []
		},
		lake: {
			name: 'lake',
			description: 'Hmm... water...',
			probability: 2,
			searchTime: 80,
			searchCapacity: 0,
			searchResources: []
		},
		mud: {
			name: 'mud',
			description: 'Caution mud...',
			probability: 1,
			searchTime: 160,
			searchCapacity: 15,
			searchResources: ['clay', 'acorus']
		},
		cave: {
			name: 'cave',
			description: 'Huh, an unexplored cave.',
			probability: 5,
			searchTime: 320,
			searchCapacity: 60,
			searchResources: ['stone', 'metal']
		},
		mountain: {
			name: 'mountain',
			description: 'Insurmountable',
			probability: 1,
			searchTime: 0,
			searchCapacity: 0,
			searchResources: []
		}
	};

	this.terrainTypesByProbability = [];

	// fill terrainTypesByProbability
	for (var i in this.terrainTypes) {
		if(this.terrainTypes.hasOwnProperty(i)) {
			for (var n = 0; n < this.terrainTypes[i].probability; n++) {
				this.terrainTypesByProbability.push(this.terrainTypes[i].name);
			}
		}
	}
};

/*
 * returns string random type
 */
TerrainRepository.prototype.createRandomType = function (rng, blacklist) {
	var type = '';
	do {
		var randomValue = rng ? rng() : Math.random;
		type = this.terrainTypesByProbability[Math.floor(randomValue * this.terrainTypesByProbability.length)]
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