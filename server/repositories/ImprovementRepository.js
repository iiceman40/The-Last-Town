'use strict';

var instance = null;

/**
 * Stores all improvements
 * @constructor
 */
var ImprovementRepository = function() {

	this.improvementTypes = {
		house: {
			id: 'house',
			name: 'House',
			description: 'A citizens home.',
			effect: function(player, tile){
				//theLastTown.regainAp(player, tile, 0, true);
				//theLastTown.stopTerrainEffect(tile);
			},
			costs: {wood: 4},
			requirements: {terrain: ['grass']},
			constructionTime: 10000
		},
		mill: {
			id: 'mill',
			name: 'Mill',
			description: 'Processed corn in the mill.',
			costs: {wood: 16, stone: 8},
			requirements: {terrain: ['grass']},
			constructionTime: 60000,
			improvementMenu: [
				{
					id: 'milling',
					name: 'Milling',
					description: 'Grain milling!',
					effect: function(){
						return false;
					}
				}
			],
			improvementUpdates: []
		},
		well: {
			id: 'well',
			name: 'Well',
			description: 'Cool well water is refreshing.',
			costs: {wood: 4, stone: 2},
			requirements: {terrain: ['grass']},
			constructionTime: 30000,
			improvementMenu: [
				{
					id: 'drink',
					name: 'Drink',
					description: 'Drinking out of the well!',
					effect: function(){
						//theLastTown.me().thirst(100);
					}
				}
			],
			improvementUpdates: []
		},
		farm: {
			id: 'farm',
			name: 'Farm',
			description: 'Harvesting, seeding, repeat.',
			costs: {wood: 8, seed: 24},
			requirements: {terrain: ['dirt']},
			constructionTime: 30000,
			improvementMenu: [],
			improvementUpdates: []
		},
		boardwalk: {
			id: 'boardwalk',
			name: 'Boardwalk',
			description: 'A little wooden boardwalk.',
			costs: {wood: 2},
			requirements: {terrain: ['water']},
			constructionTime: 5000,
			improvementMenu: [
				{
					id: 'fishing',
					name: 'Fishing',
					description: 'Make a good catch!',
					effect: function(player, tile){
						//theLastTown.goFishing(player, tile, 0, false)
					}
				},
				{
					id: 'smallTrap',
					name: 'Small zombie trap',
					description: 'Place small zombie trap!',
					effect: function(player, tile){
						//theLastTown.placeSmallTrap(player, tile, 0, false)
					}
				}
			],
			improvementUpdates: [
				//this.createImprovement("woodenbridge")
			]
		},
		woodenbridge: {
			id: 'woodenbridge',
			name: 'Wooden bridge',
			description: 'With the wooden bridge you can crossing the see.',
			effect: function(player, tile){
				//theLastTown.enableTileWalkable(player, tile, 0, false);
			},
			costs: {wood: 4},
			requirements: {terrain: ['water']},
			constructionTime: 10000,
			improvementMenu: [
				{
					id: 'fishing',
					name: 'Fishing',
					description: 'Make a good catch!',
					effect: function(player, tile){
						//theLastTown.goFishing(player, tile, 0, false)
					}
				}
			]
		},
		treehouse: {
			id: 'treehouse',
			name: 'Treehouse',
			description: 'A little hiding place. Safe from zombies and regaining ap.',
			effect: function(player, tile){
				//theLastTown.regainAp(player, tile, 0, true);
				//theLastTown.stopTerrainEffect(tile);
				// TODO: Player is being protected from zombies.
			},
			costs: {wood: 8},
			requirements: {terrain: ['forest']},
			constructionTime: 10000,
			improvementMenu: []
		},
		fishery: {
			id: 'fishery',
			name: 'Fishery',
			description: 'Regaining ap and sometimes you make a good catch!',
			effect: function(player, tile){
				//theLastTown.enableTileWalkable(player, tile, 0, false);
				//theLastTown.regainAp(player, tile, 0, true);
				//theLastTown.stopTerrainEffect(tile);
			},
			costs: {wood: 8},
			requirements: {terrain: ['water']},
			constructionTime: 120000,
			improvementMenu: []
		},
		woodenwatchtower: {
			id: 'woodenwatchtower',
			name: 'Woodenwatchtower',
			description: 'A watchtower for defense.',
			costs: {wood: 8},
			requirements: {terrain: ['grass']},
			constructionTime: 10000,
			improvementMenu: [
				{
					id: 'woodenwatchtowerfighting',
					name: 'Attack Zombies',
					description: 'All surrounding zombies attacked immediately. But you need long-range weapons.',
					effect: function(){
						//theLastTown.attackEnemyAround();
					}
				}
			]
		},
		blacksmith: {
			id: 'blacksmith',
			name: 'Blacksmith',
			description: 'Heat the forges and start Blacksmithing!',
			costs: {wood: 16, stone: 8, metal: 4},
			requirements: {terrain: ['grass']},
			constructionTime: 60000,
			improvementMenu: [
				{
					id: 'craftingmenu',
					name: 'Open crafting table',
					description: 'Find hidden recipes and create useful items.',
					effect: function(){
					}
				}
			]
		}
	};

};

var getInstance = function(){
	if(!instance){
		instance = new ImprovementRepository();
	}
	return instance;
};

exports.getInstance = getInstance;