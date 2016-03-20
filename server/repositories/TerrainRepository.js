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
var terrainTypes = [
	{
		name: 'dirt',
		description: 'Nothing but dirt.',
		probability: 20,
		searchTime: 5,
		searchCapacity: 0,
		searchResources: []
	},
	{
		name: 'grass',
		description: 'A plane covered with high grass.',
		probability: 20,
		searchTime: 5,
		searchCapacity: 30,
		searchResources: ['seed','wheat']
	},
	{
		name: 'forest',
		description: 'A thick forest with trees everywhere.',
		probability: 30,
		searchTime: 20,
		searchCapacity: 30,
		searchResources: ['wood', 'apple']
	},
	{
		name: 'water',
		description: 'Hmm... water...',
		probability: 2,
		searchTime: 80,
		searchCapacity: 0,
		searchResources: []
	},
	{
		name: 'mud',
		description: 'Caution mud...',
		probability: 1,
		searchTime: 160,
		searchCapacity: 15,
		searchResources: ['clay', 'acorus']
	},
	{
		name: 'cave',
		description: 'Huh, an unexplored cave.',
		probability: 5,
		searchTime: 320,
		searchCapacity: 60,
		searchResources: ['stone', 'metal']
	},
	{
		name: 'mountain',
		description: 'Insurmountable',
		probability: 1,
		searchTime: 0,
		searchCapacity: 0,
		searchResources: []
	}
];

/*
 * returns string random type
 */
createRandomType = function(){
	types = [];
	for(i=0; i<terrainTypes.length; i++){
		type = terrainTypes[i];
		for(n=0; n<type.probability; n++){
			types.push(type.name);
		}
	}
	index = Math.floor(Math.random() * types.length);
	return types[index];
};

exports.createRandomType = createRandomType;