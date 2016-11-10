'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Schema
var PlayerSchema = mongoose.Schema({
	user:       {type: Schema.Types.ObjectId, ref: 'User', required: true},
	game:       {type: Schema.Types.ObjectId, ref: 'Game', required: true},
	name:       String,
	level:      Number,
	inventory:  Array,
	skills:     Array,
	position:   {
		x:        Number,
		y:        Number
	}
});

// export model
module.exports = mongoose.model('Player', PlayerSchema);