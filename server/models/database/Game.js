'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Schema
var GameSchema = mongoose.Schema({
	name:           {type: String, required: true},
	status:         {type: Number, required: true},
	players:        [{ type: Schema.Types.ObjectId, ref: 'Player' }],
	map:            {type: Object, required: true}
});

// export model
module.exports = mongoose.model('Game', GameSchema);