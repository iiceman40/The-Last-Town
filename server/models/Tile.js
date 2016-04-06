'use strict';

// Schema
var Tile = function(data){
	this.terrain = data.terrain;
	this.position = data.position;
	this.fogOfWar = data.fogOfWar || true;

	this.availableImprovements =  data.availableImprovements || [];
	this.improvements =  data.improvements || [];
	this.visibleNeighbors =  data.visibleNeighbors || [];
	this.enemies =  data.enemies || [];
	this.stuff =  data.stuff || []
};

// export model
module.exports = Tile;