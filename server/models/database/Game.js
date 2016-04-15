'use strict';

var mongoose = require('mongoose');
const GAME_STATE_ACTIVE = 1;

// Schema
var GameSchema = mongoose.Schema({
	name:           {type: String, required: true},
	status:         {type: Number, required: true},
	players:        {type: Array, required: true},
	map:            {type: Object, required: true}
});

// export model
module.exports = mongoose.model('Game', GameSchema);